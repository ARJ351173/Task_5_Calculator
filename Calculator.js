import React, { useState, useEffect, useCallback } from 'react';
import { evaluate } from 'mathjs';
import Button from './Button';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);

  const handleEvaluate = useCallback(() => {
    try {
      let evaluatedInput = input.replace(/x/g, '*').replace(/÷/g, '/');
      evaluatedInput = evaluatedInput.replace(/(\d+(\.\d+)?)(%)/g, '($1/100)');
      const percentageRegex = /(\d+(\.\d+)?)([+\-*/])(\d+(\.\d+)?%)/g;
      evaluatedInput = evaluatedInput.replace(percentageRegex, (match, p1, p2, operator, p3) => {
        const percentageValue = parseFloat(p3) / 100;
        return `${p1}${operator}(${p1}*${percentageValue})`;
      });

      const result = evaluate(evaluatedInput); 
      setOutput(result.toString());
      setInput(result.toString());
      setIsResultDisplayed(true);
    } catch (error) {
      setOutput('Error');
      setIsResultDisplayed(true);
    }
  }, [input]);

  const handleKeyPress = useCallback((value) => {
    if (isResultDisplayed && /[\d.]/.test(value)) {
      setInput(value);
      setIsResultDisplayed(false);
    } else {
      setInput((prevInput) => (isResultDisplayed && /[+\-x÷.%]/.test(value) ? prevInput + value : isResultDisplayed ? value : prevInput + value));
      setIsResultDisplayed(false);
    }
  }, [isResultDisplayed]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (key === 'Enter') {
        handleEvaluate();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (/[\d+\-x÷.%]/.test(key)) {
        handleKeyPress(key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [input, handleEvaluate, handleKeyPress]);

  const handleClick = (value) => {
    if (value === '=') {
      handleEvaluate();
    } else if (value === 'AC') {
      handleClear();
    } else if (value === '⌫') {
      handleBackspace();
    } else if (value === '+/-') {
      handleToggleSign();
    } else {
      handleKeyPress(value);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsResultDisplayed(false);
  };

  const handleBackspace = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
    setIsResultDisplayed(false);
  };

  const handleToggleSign = () => {
    if (input) {
      if (input.startsWith('-')) {
        setInput(input.substring(1));
      } else {
        setInput('-' + input);
      }
    }
  };

  return (
    <div className="calculator">
      <div className="display">
        <input type="text" value={input} disabled />
        <div className="output">{output}</div>
      </div>
      <div className="buttons">
        <Button onClick={handleClick} label="AC" className="special" />
        <Button onClick={handleClick} label="+/-" className="special" />
        <Button onClick={handleClick} label="%" className="special" />
        <Button onClick={handleClick} label="÷" className="operator" />
        {[7, 8, 9].map((num) => (
          <Button key={num} onClick={handleClick} label={num.toString()} />
        ))}
        <Button onClick={handleClick} label="x" className="operator" />
        {[4, 5, 6].map((num) => (
          <Button key={num} onClick={handleClick} label={num.toString()} />
        ))}
        <Button onClick={handleClick} label="-" className="operator" />
        {[1, 2, 3].map((num) => (
          <Button key={num} onClick={handleClick} label={num.toString()} />
        ))}
        <Button onClick={handleClick} label="+" className="operator" />
        <Button onClick={handleClick} label="0" className="zero" />
        <Button onClick={handleClick} label="." />
        <Button onClick={handleClick} label="=" className="equals" />
      </div>
    </div>
  );
};

export default Calculator;
