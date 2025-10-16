import { useState } from "react";
import "../css/Dropdown.css";

interface Props {
  label?: string;
  options: string[];
  onSelect?: (option: string) => void;
}

function Dropdown({ label, options, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect && onSelect(option);
  };

  return (
    // <div className="dropdown">
    //   {label && <label>{label} ^</label>}
    <div onClick={() => setIsOpen(!isOpen)} className="dropdown">
      {selected || label}
      {/* </div> */}

      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li
              className="dropdown-item"
              key={option}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
