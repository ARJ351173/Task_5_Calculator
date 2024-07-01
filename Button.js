import './Button.css';

const Button = ({ onClick, label, className }) => {
  const handleClick = () => {
    onClick(label);
  };

  return (
    <button className={`button ${className}`} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;