import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchUser, updateUser, updateProfileImage, changePassword } from "../../apis/users";

// 이름 변경 모달
const NameChangeModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4">{t("account.nameChangeTitle")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("account.nameChangePlaceholder")}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-white"
              style={{ background: "#ff651b" }}
            >
              {t("account.change")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 비밀번호 변경 모달
const PasswordChangeModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError(t("account.passwordNotMatch"));
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) return;
    await onSubmit(oldPassword, newPassword);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4">{t("account.passwordChangeTitle")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={t("account.currentPassword")}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("account.newPassword")}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("account.confirmNewPassword")}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            required
          />
          {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-white"
              style={{ background: "#ff651b" }}
            >
              {t("account.change")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AccountSetting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; profileImageUrl?: string }>({ name: "" });
  const [profileImage, setProfileImage] = useState<string>("");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchUser();
        setUser({ name: res.data.name, profileImageUrl: res.data.profileImageUrl });
        setProfileImage(res.data.profileImageUrl || "");
      } catch {
        setStatusMessage(t("account.loadError"));
      }
    };
    loadUser();
  }, [t]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage(t("account.imageSizeError"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatusMessage(t("account.imageTypeError"));
      return;
    }

    try {
      setIsUploading(true);
      setStatusMessage("");

      const res = await updateProfileImage(file);
      setStatusMessage(res.message);

      const updated = await fetchUser();
      setProfileImage(updated.data.profileImageUrl || "");
    } catch (error) {
      console.error("프로필 이미지 변경 실패:", error);
      setStatusMessage(t("account.imageUploadFail"));
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleNameChange = async (name: string) => {
    try {
      const res = await updateUser({ name });
      setUser((prev) => ({ ...prev, name: res.data.name }));
      setStatusMessage(res.message);
    } catch {
      setStatusMessage(t("account.nameChangeFail"));
    }
  };

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      const res = await changePassword({ oldPassword, newPassword });
      setStatusMessage(res.message);
    } catch {
      setStatusMessage(t("account.passwordChangeFail"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        {/* 상단 네비 */}
        <div className="flex items-center mb-8">
          <button
            className="text-gray-500 text-lg font-semibold flex items-center"
            onClick={() => navigate("/mypage")}
          >
            <span className="mr-1 text-2xl">&#8592;</span> {t("account.back")}
          </button>
        </div>
        <div className="flex-1 text-center mb-10">
          <span className="text-2xl font-bold">{t("account.title")}</span>
        </div>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-100 mb-2">
            {profileImage ? (
              <img src={profileImage} alt={t("account.profileImageAlt")} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">{t("account.profileImageAlt")}</span>
            )}
          </div>
          <label
            htmlFor="profile-image"
            className={`px-4 py-2 rounded text-white cursor-pointer ${
              isUploading ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
            style={{ background: isUploading ? "#ccc" : "#ff651b" }}
          >
            {isUploading ? t("account.uploading") : t("account.changeProfile")}
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* 이름 */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">{t("account.name")}</label>
          <div className="flex items-center">
            <input
              type="text"
              value={user.name}
              disabled
              className="flex-1 bg-gray-100 border border-gray-200 rounded px-3 py-2 mr-2"
            />
            <button
              className="p-2 rounded text-white flex items-center"
              style={{ background: "#ff651b" }}
              onClick={() => setIsNameModalOpen(true)}
            >
              {t("account.changeName")}
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="mb-8">
          <label className="block text-gray-600 mb-1">{t("account.password")}</label>
          <div className="flex items-center">
            <input
              type="password"
              value="**********"
              disabled
              className="flex-1 bg-gray-100 border border-gray-200 rounded px-3 py-2 mr-2"
            />
            <button
              className="p-2 rounded text-white flex items-center"
              style={{ background: "#ff651b" }}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              {t("account.changePassword")}
            </button>
          </div>
        </div>

        {/* 상태 메시지 */}
        {statusMessage && (
          <div
            className={`text-center text-sm mb-2 ${
              statusMessage.includes("성공") ? "text-green-500" : "text-red-500"
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>

      {/* 모달 */}
      <NameChangeModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSubmit={handleNameChange}
      />
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
};

export default AccountSetting;