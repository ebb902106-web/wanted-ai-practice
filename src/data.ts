import {
  Bath,
  BedDouble,
  Headphones,
  HeartHandshake,
  Home,
  MessageCircleHeart,
  Music,
  Sparkles,
  Utensils,
  Wind,
} from "lucide-react";
import type { ComponentType } from "react";

export type RecoveryStyle = "music" | "senses" | "body" | "emotion" | "space" | "connection" | "rest";

export type Option = {
  id: string;
  label: string;
  detail: string;
  score: number;
  styles?: RecoveryStyle[];
};

export type Question = {
  id: string;
  eyebrow: string;
  title: string;
  options: Option[];
};

export type Action = {
  title: string;
  time: string;
  level: 1 | 2 | 3;
  styles: RecoveryStyle[];
  body: string;
  steps: string[];
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

export type ResultLevel = {
  id: string;
  min: number;
  max: number;
  name: string;
  tone: string;
  summary: string;
  description: string;
  focus: string;
};

export const questions: Question[] = [
  {
    id: "mood",
    eyebrow: "기분의 날씨",
    title: "오늘 마음은 어떤 쪽에 가까워?",
    options: [
      { id: "cloudy", label: "조금 흐림", detail: "가라앉긴 했지만 움직일 여지는 있어.", score: 1, styles: ["senses"] },
      { id: "flat", label: "아무것도 하기 싫음", detail: "해야 할 일이 보여도 몸이 잘 안 따라와.", score: 2, styles: ["rest", "body"] },
      { id: "heavy", label: "이유 없이 무거움", detail: "마음 한쪽이 계속 눌려 있는 느낌이야.", score: 3, styles: ["emotion"] },
      { id: "numb", label: "감정이 거의 안 느껴짐", detail: "좋고 싫음도 멀어진 것 같아.", score: 4, styles: ["senses", "connection"] },
    ],
  },
  {
    id: "energy",
    eyebrow: "몸 배터리",
    title: "지금 몸의 에너지는 어느 정도야?",
    options: [
      { id: "sixty", label: "60% 이상", detail: "작게 시작하면 꽤 할 수 있을 것 같아.", score: 0, styles: ["body", "space"] },
      { id: "thirty", label: "30~60%", detail: "쉬운 일 하나 정도는 가능해.", score: 1, styles: ["senses"] },
      { id: "ten", label: "10~30%", detail: "일어나기까지 시간이 필요해.", score: 3, styles: ["rest"] },
      { id: "zero", label: "거의 0%", detail: "누워 있는 것 말고는 어렵게 느껴져.", score: 4, styles: ["rest", "connection"] },
    ],
  },
  {
    id: "thoughts",
    eyebrow: "머릿속 소리",
    title: "생각은 어떤 모양으로 돌고 있어?",
    options: [
      { id: "messy", label: "조금 복잡함", detail: "정리는 안 됐지만 견딜 만해.", score: 1, styles: ["space"] },
      { id: "loop", label: "같은 생각 반복", detail: "멈추고 싶은데 계속 되감기돼.", score: 2, styles: ["music", "body"] },
      { id: "blame", label: "나를 탓하는 생각", detail: "내가 문제인 것처럼 느껴져.", score: 3, styles: ["emotion", "connection"] },
      { id: "blank", label: "생각하기도 지침", detail: "판단하거나 고르는 것도 부담스러워.", score: 4, styles: ["rest", "senses"] },
    ],
  },
  {
    id: "routine",
    eyebrow: "기본 루틴",
    title: "최근 잠, 식사, 씻기는 어땠어?",
    options: [
      { id: "kept", label: "대체로 유지됨", detail: "완벽하진 않아도 기본은 챙겼어.", score: 0, styles: ["body"] },
      { id: "loose", label: "조금 흐트러짐", detail: "한두 가지가 자주 밀려.", score: 1, styles: ["space", "senses"] },
      { id: "broken", label: "많이 무너짐", detail: "씻기나 먹기가 꽤 버거워.", score: 3, styles: ["senses", "rest"] },
      { id: "missing", label: "거의 못 챙김", detail: "기본적인 것도 시작이 안 돼.", score: 4, styles: ["connection", "rest"] },
    ],
  },
  {
    id: "people",
    eyebrow: "사람과의 거리",
    title: "지금 사람을 대하는 느낌은?",
    options: [
      { id: "talk", label: "누군가와 말하고 싶음", detail: "말하면 조금 풀릴 것 같아.", score: 0, styles: ["connection"] },
      { id: "one", label: "편한 한 명은 괜찮음", detail: "부담 없는 사람이라면 가능해.", score: 1, styles: ["connection"] },
      { id: "alone", label: "아무도 만나기 싫음", detail: "혼자 있고 싶은 마음이 커.", score: 2, styles: ["music", "space"] },
      { id: "hard", label: "연락 보는 것도 힘듦", detail: "알림 하나도 크게 느껴져.", score: 4, styles: ["rest"] },
    ],
  },
  {
    id: "craving",
    eyebrow: "회복 취향",
    title: "지금 이 중에서 제일 덜 부담스러운 건 뭐야?",
    options: [
      { id: "sound", label: "익숙한 노래 하나 틀어두기", detail: "가사를 따라 부르지 않아도 되고, 그냥 배경에 깔아두는 정도.", score: 0, styles: ["music"] },
      { id: "warm", label: "따뜻한 물이나 향을 느끼기", detail: "샤워까지는 아니어도 손 씻기, 따뜻한 차, 핸드크림 정도는 가능해.", score: 0, styles: ["senses"] },
      { id: "tiny", label: "눈앞의 물건 3개만 치우기", detail: "방 전체 말고 컵, 휴지, 옷처럼 바로 보이는 것만 옆으로 빼기.", score: 0, styles: ["space"] },
      { id: "none", label: "누가 하나만 정해줬으면 좋겠어", detail: "고르는 것도 피곤해서 가장 쉬운 행동 하나만 받고 싶어.", score: 2, styles: ["rest"] },
    ],
  },
  {
    id: "wish",
    eyebrow: "지금 필요한 것",
    title: "오늘 가장 받고 싶은 도움은 뭐야?",
    options: [
      { id: "restart", label: "다시 시작하는 신호", detail: "작은 의식처럼 몸을 깨우고 싶어.", score: 0, styles: ["body", "senses"] },
      { id: "comfort", label: "나를 덜 미워하는 말", detail: "내 편이 되는 문장이 필요해.", score: 1, styles: ["emotion"] },
      { id: "quiet", label: "조용한 회복 공간", detail: "자극을 줄이고 숨을 고르고 싶어.", score: 1, styles: ["rest", "space"] },
      { id: "signal", label: "혼자가 아니라는 신호", detail: "길게 말하지 않아도 연결되고 싶어.", score: 2, styles: ["connection"] },
    ],
  },
];

export const resultLevels: ResultLevel[] = [
  {
    id: "cloud",
    min: 0,
    max: 6,
    name: "흐린 날 모드",
    tone: "아직 마음 안쪽에 움직일 여지가 남아 있어요.",
    summary: "기분이 조금 가라앉았지만, 작은 자극이나 루틴으로 방향을 바꾸기 좋은 상태예요.",
    description: "지금 필요한 건 큰 결심보다 기분의 표면을 살짝 흔드는 행동이에요. 오늘의 회복은 빠르게 끝나는 작은 미션으로 충분합니다.",
    focus: "가벼운 감각 전환",
  },
  {
    id: "battery",
    min: 7,
    max: 13,
    name: "배터리 절약 모드",
    tone: "의지가 약한 게 아니라 에너지를 아껴야 하는 날에 가까워요.",
    summary: "무기력감이 꽤 올라와 있어서 많은 일을 해내려 하면 더 지칠 수 있어요.",
    description: "하루 전체를 고치려 하지 말고, 몸이 '아, 나 돌봄 받고 있구나'라고 알아차릴 수 있는 행동 하나를 고르는 게 좋아요.",
    focus: "낮은 난이도의 자기돌봄",
  },
  {
    id: "pause",
    min: 14,
    max: 20,
    name: "마음 정지 모드",
    tone: "지금은 생각보다 몸과 환경을 먼저 다뤄야 할 때예요.",
    summary: "감정과 생각이 무겁고 기본 루틴도 흔들릴 수 있는 상태예요.",
    description: "스스로를 설득하려 애쓰면 더 피곤할 수 있어요. 선택지를 줄이고, 따뜻함, 물, 소리, 빛처럼 단순한 자극부터 회복을 시작해보세요.",
    focus: "선택지를 줄인 회복",
  },
  {
    id: "urgent",
    min: 21,
    max: 28,
    name: "긴급 회복 모드",
    tone: "혼자 더 세게 버티기보다 신호를 보내야 하는 상태에 가까워요.",
    summary: "마음 에너지가 많이 낮아져 있고, 기본적인 돌봄도 혼자 감당하기 어려울 수 있어요.",
    description: "오늘의 목표는 기분을 완전히 좋게 만드는 게 아니라 안전하게 지나가는 거예요. 가능한 가장 쉬운 행동 하나와, 부담이 가장 적은 연결 하나를 권해요.",
    focus: "안전과 연결",
  },
];

export const actions: Action[] = [
  {
    title: "살아나는 플레이리스트 만들기",
    time: "12분",
    level: 2,
    styles: ["music", "emotion"],
    body: "힘내라는 노래 말고, 예전에 내가 조금이라도 살아나는 느낌을 받았던 곡만 7개 모아요.",
    steps: ["첫 곡은 무조건 익숙한 곡으로 고르기", "제목을 '내가 돌아오는 소리'처럼 붙이기", "마지막 곡은 템포가 조금 더 빠른 곡으로 두기"],
    icon: Music,
  },
  {
    title: "30분 꼼꼼 샤워",
    time: "30분",
    level: 3,
    styles: ["senses", "body"],
    body: "씻는 일을 숙제가 아니라 몸을 다시 데려오는 의식처럼 해요.",
    steps: ["따뜻한 물을 어깨에 3분 맞기", "샴푸 향을 일부러 한 번 맡기", "마지막에 깨끗한 수건으로 얼굴을 천천히 누르기"],
    icon: Bath,
  },
  {
    title: "침대 위 한 칸 리셋",
    time: "7분",
    level: 1,
    styles: ["space", "rest"],
    body: "방 전체 말고 침대 위만 정리해요. 누울 자리를 회복하는 게 목표예요.",
    steps: ["침대 위 물건을 바닥 한쪽에만 모으기", "이불을 크게 한 번 털기", "베개 방향을 바꾸고 다시 눕기"],
    icon: BedDouble,
  },
  {
    title: "오늘의 마음 제목 붙이기",
    time: "5분",
    level: 1,
    styles: ["emotion", "rest"],
    body: "긴 일기 대신 지금 상태에 제목만 붙여요. 설명하지 않아도 괜찮아요.",
    steps: ["메모장에 '오늘의 제목:' 쓰기", "예: 축축한 솜, 화면 꺼진 날, 얇은 유리", "마지막 줄에 '그래도 지나가는 중' 적기"],
    icon: Sparkles,
  },
  {
    title: "편의점 생존 메뉴 고르기",
    time: "15분",
    level: 2,
    styles: ["body", "senses"],
    body: "건강식 말고 지금 먹을 수 있는 가장 현실적인 조합을 고르는 미션이에요.",
    steps: ["따뜻한 것 1개 고르기", "씹기 쉬운 것 1개 고르기", "물이나 이온음료처럼 넘기기 쉬운 것 더하기"],
    icon: Utensils,
  },
  {
    title: "알림 없는 10분 동굴",
    time: "10분",
    level: 1,
    styles: ["rest", "space"],
    body: "무언가를 해내는 시간이 아니라, 자극을 잠깐 낮추는 시간이에요.",
    steps: ["휴대폰을 뒤집어두기", "조명 하나만 남기기", "타이머 10분 동안 아무것도 평가하지 않기"],
    icon: Wind,
  },
  {
    title: "나에게 보내는 카톡 3줄",
    time: "6분",
    level: 1,
    styles: ["emotion", "connection"],
    body: "누구에게 보내지 않아도 돼요. 대화창 말투로 나에게만 말해요.",
    steps: ["'오늘 내가 힘든 이유는'으로 시작하기", "딱 3줄만 쓰기", "마지막은 '이 정도로도 말한 거야'로 끝내기"],
    icon: MessageCircleHeart,
  },
  {
    title: "새 콘텐츠 찾지 않기",
    time: "20분",
    level: 1,
    styles: ["music", "rest"],
    body: "새로운 걸 고르는 에너지를 쓰지 말고, 이미 좋아했던 영상이나 노래로 돌아가요.",
    steps: ["예전에 저장한 영상 하나 열기", "댓글과 추천 영상은 보지 않기", "끝나면 바로 화면 끄기"],
    icon: Headphones,
  },
  {
    title: "몸에 다시 시작 신호 주기",
    time: "8분",
    level: 1,
    styles: ["body", "senses"],
    body: "큰 변화 대신 몸이 알아들을 수 있는 작은 신호 세 개를 줘요.",
    steps: ["양말 갈아신기", "세수하거나 손목까지 씻기", "립밤이나 핸드크림 바르기"],
    icon: Sparkles,
  },
  {
    title: "이모티콘 하나 보내기",
    time: "3분",
    level: 1,
    styles: ["connection", "rest"],
    body: "길게 설명하지 않고 연결 신호만 보내요. 답장을 바로 할 필요도 없어요.",
    steps: ["가장 덜 부담스러운 대화방 열기", "말 대신 이모티콘 하나만 보내기", "보낸 뒤 알림을 20분 꺼두기"],
    icon: HeartHandshake,
  },
  {
    title: "방의 온도 한 가지 바꾸기",
    time: "5분",
    level: 1,
    styles: ["space", "senses"],
    body: "인생 말고 방의 감각 하나만 바꿔요. 환기, 조명, 담요 중 하나면 충분해요.",
    steps: ["창문을 2분만 열기 또는 닫기", "조명을 더 따뜻하게 바꾸기", "몸에 닿는 천 하나를 깨끗한 것으로 바꾸기"],
    icon: Home,
  },
  {
    title: "도움 요청 문장 복사하기",
    time: "4분",
    level: 1,
    styles: ["connection", "emotion"],
    body: "직접 말하기 어렵다면 문장을 빌려도 돼요. 보내지 않아도 일단 복사해둡니다.",
    steps: ["'나 오늘 상태가 많이 안 좋아서 혼자 있기 힘들어' 복사하기", "보낼 사람 한 명만 떠올리기", "보낼 수 있으면 보내고, 어렵다면 즐겨찾기에 저장하기"],
    icon: HeartHandshake,
  },
];
