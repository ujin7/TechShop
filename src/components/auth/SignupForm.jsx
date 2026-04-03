'use client';
/**
 * ## SignupForm
 *
 * ### Props
 * @param {function} onSuccess       - 가입 성공 콜백
 * @param {function} onSwitchToLogin - "로그인" 링크 클릭 콜백
 *
 * ### Hooks (내부 사용)
 * const { signup, isLoading, authError } = useAuth()
 *
 * ### 필드 & 유효성 검사
 * - 이름: 필수
 * - 이메일: 형식 체크
 * - 비밀번호: 8자 이상, 영문+숫자 조합 권장 (strength 인디케이터 표시)
 * - 비밀번호 확인: 일치 여부
 */
export default function SignupForm({ onSuccess: _onSuccess = () => {}, onSwitchToLogin: _onSwitchToLogin = () => {} }) {
  return null; // TODO: Antigravity UI
}
