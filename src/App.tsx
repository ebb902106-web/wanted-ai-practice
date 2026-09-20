import { ArrowLeft, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { actions, questions, resultLevels, type Action, type RecoveryStyle } from "./data";
import { Badge, Button, Card, ChoiceCard, Progress, RadioGroup } from "./components/ui";

type Answers = Record<string, string>;

function getResult(score: number) {
  return resultLevels.find((level) => score >= level.min && score <= level.max) ?? resultLevels[0];
}

function getSelectedStyles(answers: Answers): RecoveryStyle[] {
  return questions.flatMap((question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    return selected?.styles ?? [];
  });
}

function getScore(answers: Answers) {
  return questions.reduce((total, question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    return total + (selected?.score ?? 0);
  }, 0);
}

function pickActions(score: number, preferredStyles: RecoveryStyle[]) {
  const styleWeight = preferredStyles.reduce<Record<string, number>>((map, style) => {
    map[style] = (map[style] ?? 0) + 1;
    return map;
  }, {});

  const maxLevel = score >= 21 ? 1 : score >= 14 ? 2 : 3;

  return actions
    .map((action) => {
      const preference = action.styles.reduce((sum, style) => sum + (styleWeight[style] ?? 0), 0);
      const levelFit = action.level <= maxLevel ? 2 : -2;
      const urgentBoost = score >= 21 && action.styles.includes("connection") ? 3 : 0;
      return { action, rank: preference + levelFit + urgentBoost };
    })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .map(({ action }) => action);
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
  const recommendedActions = useMemo(() => pickActions(score, getSelectedStyles(answers)), [answers, score]);

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
              <span className="result-kicker">지금의 우웅 상태</span>
              <h1>{result.name}</h1>
              <p>{result.tone}</p>
            </div>
            <div className="result-grid">
              <div>
                <strong>상태 해석</strong>
                <p>{result.summary}</p>
              </div>
              <div>
                <strong>오늘의 초점</strong>
                <p>{result.focus}</p>
              </div>
            </div>
            <p className="result-description">{result.description}</p>
          </Card>

          <section className="actions-section">
            <div className="section-heading">
              <span>오늘 바로 해볼 회복 행동</span>
              <h2>뻔하지 않게, 하지만 너무 어렵지 않게</h2>
            </div>
            <div className="action-grid">
              {recommendedActions.map((action) => (
                <ActionCard key={action.title} action={action} />
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
            <Progress value={progress} />
          </div>

          <div className="question-heading">
            <span>{currentQuestion.eyebrow}</span>
            <h2>{currentQuestion.title}</h2>
          </div>

          <RadioGroup>
            {currentQuestion.options.map((option) => (
              <ChoiceCard
                key={option.id}
                id={`${currentQuestion.id}-${option.id}`}
                name={currentQuestion.id}
                checked={selected === option.id}
                label={option.label}
                detail={option.detail}
                onChange={() => selectOption(option.id)}
              />
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

function ActionCard({ action }: { action: Action }) {
  const Icon = action.icon;

  return (
    <Card className="action-card">
      <div className="action-meta">
        <span className="icon-chip">
          <Icon size={20} />
        </span>
        <div>
          <Badge>난이도 {action.level}</Badge>
          <span>{action.time}</span>
        </div>
      </div>
      <h3>{action.title}</h3>
      <p>{action.body}</p>
      <ol>
        {action.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </Card>
  );
}

export { App };
