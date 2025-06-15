// src/pages/Festival/LoadingFestival.tsx

export function LoadingFestival() {
  // 카드(그리드) 스켈레톤 개수 조절
  const GRID_SKELETON_COUNT = 8;
  return (
    <div className="min-h-screen bg-[#fffefb]">
      {/* 제목, 안내문구 */}
      <div className="max-w-screen-xl mx-auto px-4 pt-28 pb-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-56 rounded-lg bg-gray-200 animate-pulse" />
          <div className="mx-auto h-4 w-96 rounded bg-gray-100 animate-pulse" />
        </div>
        {/* FeaturedFestivalSlider 스켈레톤 */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-7 w-24 rounded-lg bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50">
            <div className="h-80 lg:h-96 w-full bg-gray-200 animate-pulse" />
          </div>
          <div className="mt-4 text-center">
            <div className="h-4 w-32 mx-auto bg-gray-100 rounded animate-pulse" />
          </div>
        </section>
        {/* 필터바 스켈레톤 */}
        <div className="mb-6 h-12 w-full max-w-xl mx-auto bg-gray-100 rounded-lg animate-pulse" />
        {/* FestivalGrid(카드) 스켈레톤 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: GRID_SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-[#fffefb] shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-200" />
              <div className="p-5">
                <div className="h-6 w-36 bg-gray-200 rounded mb-2" />
                <div className="flex flex-col gap-1 mb-3">
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                  <div className="h-4 w-28 bg-gray-100 rounded" />
                </div>
                <div className="h-4 w-full bg-gray-100 rounded mb-4" />
                <div className="flex gap-1">
                  <div className="h-5 w-14 bg-gray-100 rounded" />
                  <div className="h-5 w-10 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
