import { PrismaClient, UserRole, AssetStatus, RequestStatus, UrgencyLevel, DealStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 삽입 시작...");

  // ── 유저 생성 ──
  const adminHash = await bcrypt.hash("12345678", 12);
  const sellerHash = await bcrypt.hash("12345678", 12);
  const buyerHash = await bcrypt.hash("12345678", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@root.com" },
    update: { role: UserRole.ADMIN },
    create: {
      name: "송민준",
      email: "admin@root.com",
      passwordHash: adminHash,
      companyName: "ROOT",
      role: UserRole.ADMIN,
    },
  });

  const seller1 = await prisma.user.upsert({
    where: { email: "seller1@test.com" },
    update: {},
    create: {
      name: "김철수",
      email: "seller1@test.com",
      passwordHash: sellerHash,
      companyName: "대한물류",
      role: UserRole.SELLER,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@test.com" },
    update: {},
    create: {
      name: "이영희",
      email: "seller2@test.com",
      passwordHash: sellerHash,
      companyName: "한국건설",
      role: UserRole.SELLER,
    },
  });

  const buyer1 = await prisma.user.upsert({
    where: { email: "buyer1@test.com" },
    update: {},
    create: {
      name: "박지훈",
      email: "buyer1@test.com",
      passwordHash: buyerHash,
      companyName: "신흥산업",
      role: UserRole.BUYER,
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: "buyer2@test.com" },
    update: {},
    create: {
      name: "최수진",
      email: "buyer2@test.com",
      passwordHash: buyerHash,
      companyName: "미래물류",
      role: UserRole.BUYER,
    },
  });

  console.log("✅ 유저 5명 생성 완료");

  // ── 자산 10개 ──
  const assetsData = [
    {
      ownerUserId: seller1.id,
      assetTitle: "지게차 2.5t (Toyota 8FD25)",
      category: "물류장비",
      subcategory: "지게차",
      manufacturer: "Toyota",
      modelName: "8FD25",
      quantity: 1,
      unit: "대",
      conditionGrade: "B",
      locationRegion: "경기도 화성시",
      askingPrice: 8500000,
      priceNegotiable: true,
      description: "2018년식, 주행시간 2,300h. 엔진 정상, 외관 양호. 직접 확인 가능.",
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller2.id,
      assetTitle: "이동식 크레인 5t",
      category: "건설장비",
      subcategory: "크레인",
      manufacturer: "Tadano",
      modelName: "GR-500N",
      quantity: 1,
      unit: "대",
      conditionGrade: "C",
      locationRegion: "인천 남동구",
      askingPrice: 12000000,
      priceNegotiable: true,
      description: "2015년식. 붐 길이 31m. 약간의 외관 손상 있으나 작동 이상 없음.",
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller1.id,
      assetTitle: "파렛트 랙 (5단, 20열)",
      category: "창고설비",
      subcategory: "랙",
      manufacturer: "삼성물류시스템",
      quantity: 1,
      unit: "식",
      conditionGrade: "A",
      locationRegion: "경기도 이천시",
      askingPrice: 4200000,
      priceNegotiable: false,
      description: "창고 이전으로 처분. 설치된 상태 그대로 판매. 해체 후 인수 가능.",
      dismantlingRequired: true,
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller2.id,
      assetTitle: "컨베이어벨트 10m",
      category: "물류장비",
      subcategory: "컨베이어",
      quantity: 2,
      unit: "세트",
      conditionGrade: "B",
      locationRegion: "부산 사하구",
      askingPrice: 3000000,
      priceNegotiable: true,
      description: "폭 600mm, 모터 포함. 2세트 일괄 판매 또는 개별 판매 가능.",
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller1.id,
      assetTitle: "굴삭기 0.4 (현대 R140)",
      category: "건설장비",
      subcategory: "굴삭기",
      manufacturer: "현대",
      modelName: "R140LC-9",
      quantity: 1,
      unit: "대",
      conditionGrade: "B",
      locationRegion: "경남 창원시",
      askingPrice: 22000000,
      priceNegotiable: true,
      description: "2017년식, 작업시간 4,100h. 버킷 포함. 현장 직인도 가능.",
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller2.id,
      assetTitle: "산업용 선반기계 (대우 DL-750)",
      category: "제조장비",
      subcategory: "선반",
      manufacturer: "대우",
      modelName: "DL-750",
      quantity: 1,
      unit: "대",
      conditionGrade: "B",
      locationRegion: "경기도 안산시",
      askingPrice: 7800000,
      priceNegotiable: false,
      description: "공장 이전으로 처분. 2016년식, 가동 이상 없음. 이전비 별도.",
      transportRequired: true,
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller1.id,
      assetTitle: "발전기 30kVA",
      category: "전기설비",
      subcategory: "발전기",
      manufacturer: "Cummins",
      quantity: 2,
      unit: "대",
      conditionGrade: "A",
      locationRegion: "서울 금천구",
      askingPrice: 5500000,
      priceNegotiable: true,
      description: "2019년식. 사용 횟수 적음. 방음형. 개별 판매 가능.",
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller2.id,
      assetTitle: "고압세척기 (업무용)",
      category: "기타장비",
      subcategory: "세척기",
      manufacturer: "Karcher",
      modelName: "HD 9/23",
      quantity: 3,
      unit: "대",
      conditionGrade: "A",
      locationRegion: "대구 달서구",
      askingPrice: 1200000,
      priceNegotiable: true,
      description: "3대 중 원하는 수량 구매 가능. 호스 및 노즐 포함.",
      status: AssetStatus.ACTIVE,
    },
    {
      ownerUserId: seller1.id,
      assetTitle: "냉동 탑차 1t (2019년식)",
      category: "물류장비",
      subcategory: "탑차",
      manufacturer: "현대",
      modelName: "포터2",
      quantity: 1,
      unit: "대",
      conditionGrade: "B",
      locationRegion: "경기도 파주시",
      askingPrice: 18000000,
      priceNegotiable: true,
      description: "2019년식, 주행거리 87,000km. 냉동기 정상. 적재함 청결 양호.",
      status: AssetStatus.PENDING_REVIEW,
    },
    {
      ownerUserId: seller2.id,
      assetTitle: "사무용 복합기 (Canon 대형)",
      category: "사무기기",
      subcategory: "복합기",
      manufacturer: "Canon",
      modelName: "iR-ADV C5560",
      quantity: 4,
      unit: "대",
      conditionGrade: "B",
      locationRegion: "서울 마포구",
      askingPrice: 400000,
      priceNegotiable: true,
      description: "사무실 이전으로 처분. 토너 잔량 있음. 일괄 또는 개별 판매.",
      status: AssetStatus.ACTIVE,
    },
  ];

  const assets = await Promise.all(
    assetsData.map((a) => prisma.asset.create({ data: a }))
  );

  console.log("✅ 자산 10개 생성 완료");

  // ── 요청 10개 ──
  const requestsData = [
    {
      requesterUserId: buyer1.id,
      requestTitle: "지게차 2~3t 1대 구매",
      category: "물류장비",
      subcategory: "지게차",
      desiredQuantity: 1,
      budgetMax: 10000000,
      preferredRegion: "경기도",
      urgencyLevel: UrgencyLevel.HIGH,
      description: "물류창고 내부 작업용. 상태 B 이상 선호. 빠른 인수 가능.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer2.id,
      requestTitle: "중고 굴삭기 급구",
      category: "건설장비",
      subcategory: "굴삭기",
      desiredQuantity: 1,
      budgetMin: 20000000,
      budgetMax: 30000000,
      preferredRegion: "충청도",
      urgencyLevel: UrgencyLevel.URGENT,
      description: "현장 투입 급함. 0.4~0.5 사이즈. 2주 내 인수 필요.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer1.id,
      requestTitle: "창고 랙 시스템 구축",
      category: "창고설비",
      subcategory: "랙",
      desiredQuantity: 1,
      budgetMax: 5000000,
      preferredRegion: "경기도 이천",
      urgencyLevel: UrgencyLevel.MEDIUM,
      description: "신규 창고 오픈 준비 중. 5단 랙 20열 이상 필요.",
      status: RequestStatus.MATCHED,
    },
    {
      requesterUserId: buyer2.id,
      requestTitle: "이동식 크레인 3~5t",
      category: "건설장비",
      subcategory: "크레인",
      desiredQuantity: 1,
      preferredRegion: "인천/경기",
      urgencyLevel: UrgencyLevel.MEDIUM,
      description: "가격 협의 가능. 상태 C 이상. 임대도 검토 중.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer1.id,
      requestTitle: "산업용 공작기계 일체",
      category: "제조장비",
      desiredQuantity: 1,
      budgetMax: 10000000,
      preferredRegion: "경기도 안산",
      urgencyLevel: UrgencyLevel.LOW,
      description: "소규모 공장 설비 구축. 선반, 밀링 등 일체 구매 희망.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer2.id,
      requestTitle: "발전기 20kVA 이상",
      category: "전기설비",
      subcategory: "발전기",
      desiredQuantity: 1,
      budgetMax: 7000000,
      preferredRegion: "전국",
      urgencyLevel: UrgencyLevel.HIGH,
      description: "정전 대비용. 30kVA 선호. 방음형이면 더 좋음.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer1.id,
      requestTitle: "냉동/냉장 탑차 구매",
      category: "물류장비",
      subcategory: "탑차",
      desiredQuantity: 1,
      budgetMax: 20000000,
      preferredRegion: "수도권",
      urgencyLevel: UrgencyLevel.HIGH,
      description: "식품 배송용. 1t 이상. 냉동기 정상 작동 필수.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer2.id,
      requestTitle: "컨베이어 라인 구매",
      category: "물류장비",
      subcategory: "컨베이어",
      desiredQuantity: 1,
      budgetMax: 4000000,
      preferredRegion: "부산/경남",
      urgencyLevel: UrgencyLevel.MEDIUM,
      description: "소형 물류센터 구축. 10m 내외. 모터 포함 일체형 선호.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer1.id,
      requestTitle: "고압세척기 2대",
      category: "기타장비",
      desiredQuantity: 2,
      budgetMax: 3000000,
      preferredRegion: "대구/경북",
      urgencyLevel: UrgencyLevel.LOW,
      description: "공장 청소용. 업무용 기준. 2대 일괄 구매 희망.",
      status: RequestStatus.ACTIVE,
    },
    {
      requesterUserId: buyer2.id,
      requestTitle: "사무기기 일괄 구매",
      category: "사무기기",
      desiredQuantity: 5,
      budgetMax: 2000000,
      preferredRegion: "서울",
      urgencyLevel: UrgencyLevel.LOW,
      description: "사무실 오픈 준비. 복합기 포함 일체 구매 희망.",
      status: RequestStatus.ACTIVE,
    },
  ];

  const requests = await Promise.all(
    requestsData.map((r) => prisma.request.create({ data: r }))
  );

  console.log("✅ 요청 10개 생성 완료");

  // ── 딜 5개 ──
  const dealsData = [
    {
      createdByAdminId: admin.id,
      dealTitle: "지게차 2.5t ↔ 지게차 구매 요청",
      assetId: assets[0].id,      // 지게차
      requestId: requests[0].id,  // 지게차 구매 요청
      expectedValue: 8500000,
      status: DealStatus.NEGOTIATING,
      notes: "양측 가격 협의 중. SELLER 8,500만 / BUYER 800만 희망. 중간선 조율 필요.",
    },
    {
      createdByAdminId: admin.id,
      dealTitle: "파렛트 랙 ↔ 창고 랙 구축 요청",
      assetId: assets[2].id,      // 파렛트 랙
      requestId: requests[2].id,  // 창고 랙 구축
      expectedValue: 4200000,
      status: DealStatus.MATCHED,
      notes: "스펙 일치 확인 완료. 해체/운반 일정 조율 중.",
    },
    {
      createdByAdminId: admin.id,
      dealTitle: "발전기 30kVA ↔ 발전기 구매 요청",
      assetId: assets[6].id,      // 발전기
      requestId: requests[5].id,  // 발전기 구매 요청
      expectedValue: 5500000,
      status: DealStatus.WON,
      finalValue: 5200000,
      notes: "거래 완료. 최종 5,200만원 합의. 2026-03-28 인수 완료.",
    },
    {
      createdByAdminId: admin.id,
      dealTitle: "굴삭기 R140 ↔ 굴삭기 급구 요청",
      assetId: assets[4].id,      // 굴삭기
      requestId: requests[1].id,  // 굴삭기 급구
      expectedValue: 22000000,
      status: DealStatus.REVIEWING,
      notes: "지역 불일치 (경남 vs 충청). 운반비 포함 여부 검토 중.",
    },
    {
      createdByAdminId: admin.id,
      dealTitle: "냉동 탑차 ↔ 탑차 구매 요청",
      assetId: assets[8].id,      // 냉동 탑차
      requestId: requests[6].id,  // 탑차 구매
      expectedValue: 18000000,
      status: DealStatus.NEW,
      notes: "자산 검토 대기 중. PENDING_REVIEW 자산 — 승인 후 진행 예정.",
    },
  ];

  await Promise.all(
    dealsData.map((d) => prisma.deal.create({ data: d }))
  );

  console.log("✅ 딜 5개 생성 완료");
  console.log("\n🎉 시드 완료!");
  console.log("─────────────────────────────");
  console.log("계정 정보 (비밀번호 모두 12345678)");
  console.log("ADMIN  : admin@root.com");
  console.log("SELLER : seller1@test.com / seller2@test.com");
  console.log("BUYER  : buyer1@test.com  / buyer2@test.com");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
