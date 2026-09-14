# 학사일정

## 폴더 구조

압축을 풀면 바로 아래 구조로 되어 있습니다. 따로 옮길 필요 없이 이 폴더 전체를 그대로 사용하면 됩니다.

```
calendar-app/
├── package.json
├── README.md
├── pages/
│   ├── _app.js
│   ├── index.js
│   ├── admin.js
│   └── api/
│       ├── events.js
│       └── verify.js
└── styles/
    └── globals.css
```

## 사용 방법

1. 이 폴더 전체를 GitHub 저장소에 올립니다.
2. Vercel(vercel.com)에서 New Project → 방금 만든 저장소 선택 → Deploy.
3. 배포된 프로젝트의 Storage 탭 → Create Database → **KV** 선택 → 생성.
   (자동으로 프로젝트에 연결되고, 환경변수도 자동으로 설정됩니다. 별도 설정 필요 없음)
4. 배포된 주소로 들어가면 누구나 학사일정을 달력/리스트로 볼 수 있습니다.
5. 주소 + `/admin` 으로 들어가면 비밀번호 입력 후 일정을 추가/삭제할 수 있습니다. 비밀번호: `3587`

## 페이지 구성

- `/` — 누구나 학사일정 조회 (달력 보기 / 리스트 보기 전환, 월 이동 가능)
- `/admin` — 비밀번호(3587) 입력 후 일정 추가·삭제

## 일정 분류

- 행사 (`event`) — 파란색
- 시험 (`exam`) — 빨간색
- 방학 (`break`) — 초록색

## 비밀번호 변경하고 싶다면

`pages/api/events.js`와 `pages/api/verify.js` 두 파일 상단의 `ADMIN_PASSWORD` 값을
**동일하게** 바꿔주세요.
