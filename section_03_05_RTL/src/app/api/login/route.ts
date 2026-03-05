// src/app/api/login/route.ts

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 간단한 유효성 검사 (실제로는 더 복잡한 로직이 필요할 수 있음)
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "이메일과 비밀번호를 입력해주세요." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 로그인 로직 (실제로는 데이터베이스와의 상호작용 & 인증 토큰 생성 등이 필요함)
  return new Response(JSON.stringify({ message: "로그인 성공!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
