import ProInputNumber from '@/components/ProInputNumber';
import { Dispatch } from 'react';

interface SwapInputType {
  value: number | null;
  onChange: (value: number | null) => void;
}

function SwapInput({ value, onChange }: SwapInputType) {
  return <ProInputNumber value={value} onChange={(value) => onChange(value)} />;
}

export default SwapInput;
