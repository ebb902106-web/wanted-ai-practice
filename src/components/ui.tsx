import type { ButtonHTMLAttributes, HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} {...props} />;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props} />;
}

export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`badge ${className}`} {...props} />;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="progress" aria-label="테스트 진행률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} role="progressbar">
      <div className="progress-indicator" style={{ width: `${value}%` }} />
    </div>
  );
}

export function RadioGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`radio-group ${className}`} role="radiogroup">{children}</div>;
}

type ChoiceCardProps = {
  id: string;
  name: string;
  checked: boolean;
  label: string;
  detail: string;
  onChange: () => void;
};

export function ChoiceCard({ id, name, checked, label, detail, onChange }: ChoiceCardProps) {
  return (
    <label className={`choice-card ${checked ? "choice-card-selected" : ""}`} htmlFor={id}>
      <input id={id} name={name} type="radio" checked={checked} onChange={onChange} />
      <span className="radio-dot" aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </label>
  );
}

export function Label({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`label ${className}`} {...props} />;
}
