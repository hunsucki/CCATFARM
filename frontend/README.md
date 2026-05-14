# CCATFARM Robot Control App

스마트팜 로봇 모니터링 및 제어를 위한 모바일 웹 애플리케이션입니다.

## 기술 스택

- React 19 + TypeScript + Vite
- react-router-dom (페이지 라우팅)
- lucide-react (아이콘)
- roslib (ROS 로봇 통신 - CDN)
- FastAPI (백엔드)

## 프로젝트 구조

```
CCATFARM/
├── backend/
│   └── main.py              # FastAPI 서버
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Joystick.tsx # 아날로그 조이스틱 컴포넌트
│   │   ├── hooks/
│   │   │   └── useRos.ts    # ROS 연결 관리 커스텀 훅
│   │   ├── pages/
│   │   │   ├── Home.tsx     # 메인 대시보드
│   │   │   ├── Map.tsx      # 로봇 맵 & 수동 제어
│   │   │   ├── Crops.tsx    # 작물 상태 모니터링
│   │   │   └── Settings.tsx # 사용자 설정
│   │   ├── App.tsx          # 라우팅 & 네비게이션
│   │   └── App.css          # 전체 스타일
│   └── index.html
```

## 실행 방법

### 1. 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 2. 백엔드

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

`http://localhost:8000` 에서 API 서버 실행

### 3. ROS 로봇 연결 (선택)

로봇과 연결하려면 rosbridge_server가 실행 중이어야 합니다.

```bash
# 로봇 측에서 실행
roslaunch rosbridge_server rosbridge_websocket.launch
```

프론트엔드에서 연결할 ROS URL을 설정하려면 `frontend/.env` 파일을 생성하세요:

```env
VITE_ROS_URL=ws://로봇_IP주소:9090
```

설정하지 않으면 기본값 `ws://localhost:9090`을 사용합니다.

## 주요 기능

- 로봇 상태 모니터링 (배터리, 위치, 순찰 상태)
- 존(Zone) 기반 맵 뷰 + 실시간 위치 표시 (`/amcl_pose`)
- EMERGENCY 버튼으로 수동 제어 모드 전환 → 아날로그 조이스틱으로 로봇 조종 (`/cmd_vel`)
- 작물 상태 필터링 (정상/비정상, 존별)
- 사용자 설정 관리

## 페이지별 라우팅

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Home | 로봇 제어 + 알림 + 작물 건강 요약 |
| `/map` | Map | 카메라 피드 + 존 맵 + 조이스틱 제어 |
| `/crops` | Crops | 작물 상태 목록 + 필터 |
| `/settings` | Settings | 사용자 정보 설정 |
