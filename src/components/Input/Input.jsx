import React from 'react';
import { InputWrapper, StyledInput, TextAreaWrapper, StyledTextArea } from './Input.styled';

function Input({ icon, ...props }) {
  return (
    <InputWrapper>
      {icon && icon}
      <StyledInput {...props} />
    </InputWrapper>
  );
}

export function TextArea({ icon, leftAction, rightAction, ...props }) {
  return (
    <TextAreaWrapper>
      {leftAction && leftAction}
      <StyledTextArea {...props} />
      {rightAction && rightAction}
    </TextAreaWrapper>
  );
}

export default Input;