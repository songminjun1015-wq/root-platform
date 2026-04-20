import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0A1628" }}>
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-orange-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            대시보드로 이동
          </Link>
          <Link
            href="/"
            className="text-white/50 hover:text-white text-sm font-medium transition-colors py-2.5"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
