import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 타이핑 중일 때, 딜레이 동안 타이머 실행
    const handler = setTimeout(() => {
      setDebouncedValue(value); // 딜레이 이후에 값 설정
    }, delay);

    // cleanup 함수로 타이머 초기화
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;