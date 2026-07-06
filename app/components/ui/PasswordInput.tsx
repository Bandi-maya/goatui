import React from 'react';
import { Input, InputProps } from './input';

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <Input ref={ref} type="password" {...props} />;
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
export { PasswordInput };
