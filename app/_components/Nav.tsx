import Link from "next/link";

const links = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/assets", label: "자산" },
  { href: "/requests", label: "요청" },
  { href: "/deals", label: "딜" },
];

const newLinks = [
  { href: "/assets/new", label: "+ 자산 등록" },
  { href: "/requests/new", label: "+ 요청 등록" },
  { href: "/deals/new", label: "+ 딜 생성" },
];

export default function Nav() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center gap-6 flex-wrap">
      <span className="font-bold text-lg tracking-tight mr-4">ROOT Admin</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="text-sm text-gray-300 hover:text-white">
          {l.label}
        </Link>
      ))}
      <div className="ml-auto flex gap-3">
        {newLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
