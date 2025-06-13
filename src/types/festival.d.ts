
export interface FestivalListItem {
  addr1: string;
  addr2?: string | null;
  areacode: string;
  contentid: string;
  contenttypeid: string;
  createdtime: string;
  firstimage?: string;
  firstimage2?: string;
  mapx: string;
  mapy: string;
  modifiedtime: string;
  tel?: string;
  title: string;
  zipcode?: string | null;
  overview?: string | null;
  item?: union | null;
}

export interface FestivalListResponse {
  status: number;
  message: string;
  data: {
    response: {
      header: {
        resultCode: string;
        resultMsg: string;
      };
      body: {
        items: {
          item: FestivalListItem[];
        };
        numOfRows: number;
        pageNo: number;
        totalCount: number;
      };
    };
  };
}
// Overview(소개/info)용
export interface FestivalInfoItem {
  contentid: string;
  contenttypeid: string;
  addr1?: string;
  addr2?: string;
  areacode?: string | null;
  createdtime?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  modifiedtime?: string;
  tel?: string;
  title?: string;
  zipcode?: string;
  overview?: string;
  dist?: string | null;
  item?: unknown;
}

export interface FestivalInfoResponse {
  status: number;
  message: string;
  data: {
    response: {
      header: {
        resultCode: string;
        resultMsg: string;
      };
      body: {
        items: {
          item: FestivalInfoItem[];
        };
        numOfRows: number;
        pageNo: number;
        totalCount: number;
      };
    };
  };
}
// Period(기간/detailIntro)용
export interface FestivalDetailIntroItem {
  contentid: string;
  contenttypeid: string;
  sponsor1?: string;
  sponsor1tel?: string;
  sponsor2?: string;
  sponsor2tel?: string;
  eventenddate?: string;
  playtime?: string;
  eventplace?: string;
  eventhomepage?: string;
  agelimit?: string;
  bookingplace?: string;
  placeinfo?: string;
  subevent?: string;
  program?: string;
  eventstartdate?: string;
  usetimefestival?: string;
  discountinfofestival?: string;
  spendtimefestival?: string;
  festivalgrade?: string;
}

export interface FestivalDetailIntroResponse {
  status: number;
  message: string;
  data: {
    response: {
      header: {
        resultCode: string;
        resultMsg: string;
      };
      body: {
        items: {
          item: FestivalDetailIntroItem[];
        };
        numOfRows: number;
        pageNo: number;
        totalCount: number;
      };
    };
  };
}

export interface FestivalDetailInfoItem {
  contentid: string;
  contenttypeid: string;
  serialnum: string;        // 순번(문자열로 옴)
  infoname: string;         // 예: "행사소개", "행사내용"
  infotext: string;         // 예: 실제 설명 HTML (줄바꿈 <br> 등 포함)
  fldgubun: string;
}

export interface FestivalDetailInfoResponse {
  status: number;
  message: string;
  data: {
    response: {
      header: {
        resultCode: string;
        resultMsg: string;
      };
      body: {
        items: {
          item: FestivalDetailInfoItem[]; // 배열
        };
        numOfRows: number;
        pageNo: number;
        totalCount: number;
      };
    };
  };
}

// 근처 먹거리(음식점) 응답
export interface LocationFoodItem {
  addr1: string;
  addr2: string;
  areacode: string;
  contentid: string;
  contenttypeid: string;
  createdtime: string;
  firstimage?: string;
  firstimage2?: string;
  mapx: string;
  mapy: string;
  modifiedtime: string;
  tel?: string;
  title: string;
  zipcode?: string | null;
  overview?: string | null;
  dist?: string; // 거리(m)
  item?: unknown | null; // 원본 응답 그대로
}

export interface LocationFoodResponse {
  status: number;
  message: string;
  data: {
    response: {
      header: {
        resultCode: string;
        resultMsg: string;
      };
      body: {
        items: {
          item: LocationFoodItem[];
        };
        numOfRows: number;
        pageNo: number;
        totalCount: number;
      };
    };
  };
}