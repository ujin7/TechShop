'use client';
/**
 * ## LoginForm
 *
 * ### Props
 * @param {function} onSuccess        - 로그인 성공 콜백
 * @param {function} onSwitchToSignup - "회원가입" 링크 클릭 콜백
 *
 * ### Hooks (내부 사용)
 * const { login, isLoading, authError } = useAuth()
 *
 * ### 유효성 검사
 * - 이메일: 형식 체크 (정규식)
 * - 비밀번호: 최소 1자 (로그인은 서버에서 최종 검증)
 *
 * ### 데모 계정 힌트 표시
 * demo@techshop.kr / demo1234
 */
export default function LoginForm({ onSuccess: _onSuccess = () => {}, onSwitchToSignup: _onSwitchToSignup = () => {} }) {
  return null; // TODO: Antigravity UI
}
