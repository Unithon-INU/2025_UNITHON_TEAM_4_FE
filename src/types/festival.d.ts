
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
// Overview(소개)용
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
          item: {
            contentid: string;
            overview?: string;
          }[];
        };
        numOfRows: number;
        pageNo: number;
        totalCount: number;
      };
    };
  };
}

// Period(기간)용
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
          item: {
            contentid: string;
            eventstartdate?: string;
            eventenddate?: string;
          }[];
        };
        numOfRows: number;
        pageNo: number;
        totalCount: number;
      };
    };
  };
}