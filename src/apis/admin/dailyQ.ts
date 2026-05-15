import { axiosInstance } from "../axios";

export type DailyQResponseItem = {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  question: string;
  answer: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  tokens?: number;
};

export type DailyQResponsesResponse = {
  responses: DailyQResponseItem[];
  total: number;
};

export type ApproveDailyQRequest = {
  responseId: number;
  tokens: number;
};

export type ApproveDailyQResponse = {
  success: boolean;
  message: string;
};

const createAuthConfig = (accessToken?: string) => {
  const token = accessToken?.trim();
  if (!token) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const MOCK_RESPONSES: DailyQResponseItem[] = [
  {
    id: 1,
    userId: "user1",
    userName: "김한성",
    userEmail: "kim.hanseong@university.edu",
    question: "공학관에서 가장 조용한 층은?",
    answer:
      "5층이 가장 조용합니다. 오후 2~4시 사이가 최고조인데 거의 아무도 없어서 집중하기 좋습니다.",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: 2,
    userId: "user2",
    userName: "이지선",
    userEmail: "lee.jisun@university.edu",
    question: "캠퍼스에서 커피가 가장 맛있는 카페는?",
    answer:
      "학생식당 옆 카페가 원두가 신선하고 가격도 합리적입니다. 바리스타도 친절하고 분위기가 좋아요.",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: 3,
    userId: "user3",
    userName: "박낙산",
    userEmail: "park.naksan@university.edu",
    question: "우촌관 도서관 개방 시간은?",
    answer:
      "월~금 9:00 ~ 22:00, 토 10:00 ~ 18:00, 일요일은 휴무입니다. 기말고사 기간에는 연장되기도 합니다.",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: 4,
    userId: "user4",
    userName: "최미래",
    userEmail: "choi.mirae@university.edu",
    question: "캠퍼스 내 가장 먹기 좋은 배달음식은?",
    answer:
      "주변에 피자, 치킨, 한식 다양한 음식이 있지만, 개인적으로는 돈까스가 가성비가 최고입니다.",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: 5,
    userId: "user5",
    userName: "정상상",
    userEmail: "jung.sangsang@university.edu",
    question: "연구관 실험실 예약은 어디서?",
    answer: "학과 사무실 홈페이지의 시설 예약 게시판에서 신청하면 되고, 대기 시간은 보통 2~3일입니다.",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
    tokens: 5,
  },
  {
    id: 6,
    userId: "user6",
    userName: "윤탐구",
    userEmail: "yoon.tamgu@university.edu",
    question: "캠퍼스에서 운동할 수 있는 장소는?",
    answer: "체육관이 지선관 지하에 있고, 테니스 코트와 농구장도 야외에 있습니다.",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "rejected",
  },
];

const USE_MOCK = true;

export const getDailyQResponses = async (
  accessToken?: string,
): Promise<DailyQResponsesResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            responses: MOCK_RESPONSES,
            total: MOCK_RESPONSES.length,
          }),
        300,
      ),
    );
  }

  const { data } = await axiosInstance.get<DailyQResponsesResponse>(
    "/admin/daily-q/responses",
    createAuthConfig(accessToken),
  );
  return data;
};

export const approveDailyQ = async (
  payload: ApproveDailyQRequest,
  accessToken?: string,
): Promise<ApproveDailyQResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            message: "승인되었습니다.",
          }),
        500,
      ),
    );
  }

  const { data } = await axiosInstance.post<ApproveDailyQResponse>(
    "/admin/daily-q/approve",
    payload,
    createAuthConfig(accessToken),
  );
  return data;
};

export const rejectDailyQ = async (
  responseId: number,
  accessToken?: string,
): Promise<ApproveDailyQResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            message: "거절되었습니다.",
          }),
        500,
      ),
    );
  }

  const { data } = await axiosInstance.post<ApproveDailyQResponse>(
    `/admin/daily-q/reject/${responseId}`,
    {},
    createAuthConfig(accessToken),
  );
  return data;
};
