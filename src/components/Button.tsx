import "../css/Button.css";

interface Props {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled }: Props) {
  return (
    <button onClick={onClick} className="button" disabled={disabled}>
      {label}
    </button>
  );
}

export default Button;
