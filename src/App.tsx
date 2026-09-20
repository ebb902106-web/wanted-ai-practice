import { ArrowLeft, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { actions, questions, resultLevels, type Action, type RecoveryStyle, type ResultLevel } from "./data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Answers = Record<string, string>;
type SelectedAnswer = {
  questionId: string;
  questionTitle: string;
  label: string;
  score: number;
  styles: RecoveryStyle[];
};

function getResult(score: number) {
  return resultLevels.find((level) => score >= level.min && score <= level.max) ?? resultLevels[0];
}

function getSelectedStyles(answers: Answers): RecoveryStyle[] {
  return questions.flatMap((question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    return selected?.styles ?? [];
  });
}

function getSelectedAnswers(answers: Answers): SelectedAnswer[] {
  return questions.flatMap((question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    if (!selected) return [];
    return [
      {
        questionId: question.id,
        questionTitle: question.title,
        label: selected.label,
        score: selected.score,
        styles: selected.styles ?? [],
      },
    ];
  });
}

function getScore(answers: Answers) {
  return questions.reduce((total, question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    return total + (selected?.score ?? 0);
  }, 0);
}

function pickActions(result: ResultLevel, preferredStyles: RecoveryStyle[]) {
  const styleWeight = preferredStyles.reduce<Record<string, number>>((map, style) => {
    map[style] = (map[style] ?? 0) + 1;
    return map;
  }, {});

  return actions
    .map((action) => {
      const preference = action.styles.reduce((sum, style) => sum + (styleWeight[style] ?? 0), 0);
      const resultStyleFit = action.styles.reduce((sum, style) => sum + (result.priorityStyles.includes(style) ? 2 : 0), 0);
      const levelFit = result.actionLevels.includes(action.level) ? 3 : -4;
      const urgentBoost = result.id === "urgent" && action.styles.includes("connection") ? 3 : 0;
      return { action, rank: preference + resultStyleFit + levelFit + urgentBoost };
    })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .map(({ action }) => action);
}

function getInsightTags(selectedAnswers: SelectedAnswer[]) {
  const styleLabels: Record<RecoveryStyle, string> = {
    music: "소리로 전환",
    senses: "감각 리셋",
    body: "몸부터 켜기",
    emotion: "생각 과부하",
    space: "주변 정리 필요",
    connection: "연결 신호 필요",
    rest: "선택 피로",
  };

  const selectedTag = selectedAnswers
    .filter((answer) => answer.score >= 2)
    .slice(0, 3)
    .map((answer) => answer.label);

  const styleTag = selectedAnswers
    .flatMap((answer) => answer.styles)
    .map((style) => styleLabels[style])
    .filter((label, index, array) => array.indexOf(label) === index)
    .slice(0, 2);

  return [...selectedTag, ...styleTag].slice(0, 5);
}

function getRecommendationReason(action: Action, result: ResultLevel, preferredStyles: RecoveryStyle[]) {
  const reasonByStyle: Record<RecoveryStyle, string> = {
    music: "머릿속이 시끄러울 때는 말보다 소리가 빠를 때가 있어요.",
    senses: "지금은 생각보다 물, 온도, 촉감 같은 감각 스위치가 잘 먹힐 수 있어요.",
    body: "몸 배터리가 낮아서 머리보다 몸을 먼저 켜는 쪽으로 골랐어요.",
    emotion: "감정을 길게 파기보다 짧게 꺼내놓는 행동이 덜 부담스러워요.",
    space: "주변이 조금만 정리돼도 우웅 소리가 덜 커질 수 있어요.",
    connection: "혼자 풀기 빡센 우웅이라, 대화보다 신호 보내기부터 잡았어요.",
    rest: "선택지가 많을수록 더 지치는 상태라 쉬운 행동으로 줄였어요.",
  };
  const matchedStyle = action.styles.find((style) => preferredStyles.includes(style)) ?? action.styles.find((style) => result.priorityStyles.includes(style)) ?? action.styles[0];

  return reasonByStyle[matchedStyle];
}

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[step];
  const progress = showResult ? 100 : Math.round((step / questions.length) * 100);
  const selected = answers[currentQuestion?.id];
  const score = useMemo(() => getScore(answers), [answers]);
  const result = getResult(score);
  const selectedAnswers = useMemo(() => getSelectedAnswers(answers), [answers]);
  const selectedStyles = useMemo(() => getSelectedStyles(answers), [answers]);
  const insightTags = useMemo(() => getInsightTags(selectedAnswers), [selectedAnswers]);
  const recommendedActions = useMemo(() => pickActions(result, selectedStyles), [result, selectedStyles]);
  const primaryAction = recommendedActions[0];
  const secondaryActions = recommendedActions.slice(1);

  const selectOption = (optionId: string) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: optionId }));
  };

  const next = () => {
    if (step === questions.length - 1) {
      setShowResult(true);
      return;
    }
    setStep((value) => value + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    return (
      <main className="app-shell">
        <section className="result-layout">
          <div className="topbar">
            <Badge>결과</Badge>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw size={16} />
              다시 하기
            </Button>
          </div>

          <Card className="result-card">
            <div className="result-heading">
              <span className="result-kicker">오늘의 우웅 리포트</span>
              <h1>{result.name}</h1>
              <p>{result.tone}</p>
            </div>
            <div className="result-grid">
              <div>
                <strong>오늘의 우웅 요약</strong>
                <p>{result.summary}</p>
              </div>
              <div>
                <strong>오늘의 초점</strong>
                <p>{result.focus}</p>
              </div>
            </div>
            <p className="result-description">{result.description}</p>
          </Card>

          <section className="report-grid">
            <Card className="report-card">
              <span className="report-label">네 답변에서 잡힌 포인트</span>
              <div className="insight-tags">
                {insightTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p>이 조합이면 “힘내자!”보다 “일단 하나만 줄이자”가 더 잘 맞아요. 갓생 말고 생존 루틴부터 갑니다.</p>
            </Card>
            <Card className="report-card avoid-card">
              <span className="report-label">오늘 하지 말 것</span>
              <ul>
                {result.avoidList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </section>

          <section className="actions-section">
            <div className="section-heading">
              <span>우웅 탈출 미션</span>
              <h2>큰 결심 말고, 지금 가능한 한 방</h2>
            </div>
            {primaryAction ? (
              <div className="primary-action-block">
                <div className="primary-action-copy">
                  <span>1순위 미션</span>
                  <strong>{primaryAction.title}</strong>
                  <p>이거 하나만 해도 오늘은 리포트 값 합니다. 완벽하게 말고 시작만 하면 됨.</p>
                </div>
                <ActionCard action={primaryAction} reason={getRecommendationReason(primaryAction, result, selectedStyles)} featured />
              </div>
            ) : null}
            <div className="action-grid">
              {secondaryActions.map((action) => (
                <ActionCard key={action.title} action={action} reason={getRecommendationReason(action, result, selectedStyles)} />
              ))}
            </div>
          </section>

          {result.id === "urgent" && (
            <Card className="safety-card">
              <ShieldCheck size={22} />
              <div>
                <strong>혼자 있기 위험하다고 느껴진다면</strong>
                <p>
                  이 테스트는 진단이 아니라 상태를 돌아보기 위한 도구예요. 지금 당장 안전이 걱정되거나 자해 생각이 든다면 가까운 사람에게 알리고,
                  자살예방상담전화 <a href="tel:+82109">109</a> 또는 <a href="https://www.129.go.kr/109">https://www.129.go.kr/109</a>에 도움을 요청해주세요.
                </p>
              </div>
            </Card>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="quiz-layout">
        <div className="intro-panel">
          <Badge>mood recovery test</Badge>
          <h1>우울하지말고 우웅하자</h1>
          <p>
            지금 마음을 몇 가지 질문으로 천천히 확인하고, 오늘의 상태에 맞는 작고 구체적인 회복 행동을 추천받아요.
          </p>
          <div className="notice">
            <strong>진단이 아니라 체크인</strong>
            <span>정답은 없어요. 지금 가장 가까운 답을 고르면 됩니다.</span>
          </div>
        </div>

        <Card className="quiz-card">
          <div className="quiz-progress">
            <span>
              {step + 1} / {questions.length}
            </span>
            <Progress value={progress} className="quiz-progress-track" />
          </div>

          <div className="question-heading">
            <span>{currentQuestion.eyebrow}</span>
            <h2>{currentQuestion.title}</h2>
          </div>

          <RadioGroup value={selected} onValueChange={selectOption}>
            {currentQuestion.options.map((option) => (
              <label
                key={option.id}
                className={`choice-card ${selected === option.id ? "choice-card-selected" : ""}`}
                htmlFor={`${currentQuestion.id}-${option.id}`}
              >
                <RadioGroupItem id={`${currentQuestion.id}-${option.id}`} value={option.id} />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
              </label>
            ))}
          </RadioGroup>

          <div className="quiz-actions">
            <Button variant="outline" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
              <ArrowLeft size={16} />
              이전
            </Button>
            <Button onClick={next} disabled={!selected}>
              {step === questions.length - 1 ? "결과 보기" : "다음"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}

function ActionCard({ action, reason, featured = false }: { action: Action; reason?: string; featured?: boolean }) {
  const Icon = action.icon;
  const imageSrc = getActionImage(action);

  return (
    <Card className={`action-card ${featured ? "action-card-featured" : ""}`}>
      {imageSrc ? (
        <div className="action-image-wrap">
          <img className="action-image" src={imageSrc} alt="" loading="lazy" />
        </div>
      ) : null}
      <div className="action-meta">
        {!imageSrc ? (
          <span className="icon-chip">
            <Icon size={20} />
          </span>
        ) : null}
        <div>
          <Badge>난이도 {action.level}</Badge>
          <span>{action.time}</span>
        </div>
      </div>
      <h3>{action.title}</h3>
      {reason ? <p className="action-reason">왜 이거냐면: {reason}</p> : null}
      <p>{action.body}</p>
      <ol>
        {action.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </Card>
  );
}

function getActionImage(action: Action) {
  const imageMap: Partial<Record<RecoveryStyle, string>> = {
    music: "/recovery-icons/music.svg",
    senses: "/recovery-icons/senses.svg",
    space: "/recovery-icons/space.svg",
    connection: "/recovery-icons/connection.svg",
  };

  return action.styles.map((style) => imageMap[style]).find(Boolean);
}

export { App };
