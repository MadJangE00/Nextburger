import streamlit as st
import requests

import requests

def supabase_email_login(email, password):
    url = "https://jvjicdvqhqkqgamqfsjb.supabase.co/auth/v1/token?grant_type=password"
    headers = {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2amljZHZxaHFrcWdhbXFmc2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODI4MjcsImV4cCI6MjA1ODM1ODgyN30.auKBjDveFXax2jeLcj1arIHeYaEuNtLgZDKUHJHRJHk",
        "Content-Type": "application/json"
    }
    data = { "email": email, "password": password }
    res = requests.post(url, headers=headers, json=data)
    return res.json() if res.status_code == 200 else None


######################################################################################################
FASTAPI_URL = "http://localhost:8000"  # 예시 주소

st.set_page_config(page_title="3D 영상 제작 플랫폼", page_icon="🎥", layout="centered")


# ------------------ 스타일 커스터마이징 ------------------


# 사이드바에 3D 캐릭터 이미지, 제목, 설명 추가
with st.sidebar:
   
    st.title("🎬 3D 영상 제작")  # 제목 추가
    st.caption("웹캠 녹화 또는 영상 업로드를 통해 3D 콘텐츠를 생성하고 유니티로 전송하세요.")  # 설명 추가
    st.image("C:/Project/3_whatcanido/image/jonghyuk.png")
    st.image("C:/Project/3_whatcanido/image/3d.png")
    


# ------------------ 유니티 전송 함수 ------------------
def send_to_unity(data):
    unity_url = "http://192.168.1.177:5001/"
    unity_res = requests.post(unity_url, json=data)
    return unity_res.status_code

# ------------------ 탭 구분 ------------------
tab1, tab2 = st.tabs(["📹 웹캠 촬영", "📤 영상 업로드"])

# ------------------ 탭 1: 웹캠 녹화 ------------------
with tab1:
    with st.container():
        st.subheader("📷 웹캠 촬영")

        cmd = st.text_input("파일명:", placeholder="파일명을 작성해주세요")

        video_bytes = None  # 영상 저장 변수 초기화

        col1, col2 = st.columns(2)

        with col1:
            if st.button("▶️ 녹화 시작", use_container_width=True):
                with st.spinner("녹화 시작 중..."):
                    try:
                        res = requests.post(f"{FASTAPI_URL}/start", params={"cmd": cmd})
                        res.raise_for_status()
                        st.success(res.json()["message"])
                    except Exception as e:
                        st.error(f"녹화 시작 실패: {e}")

        with col2:
            if st.button("⏹ 녹화 종료", use_container_width=True):
                with st.spinner("녹화 종료 중..."):
                    try:
                        res = requests.post(f"{FASTAPI_URL}/stop")
                        res.raise_for_status()
                        video_bytes = res.content
                    except Exception as e:
                        st.error(f"녹화 종료 실패: {e}")

        # 녹화 종료 후 영상 표시
        if video_bytes:
            st.markdown("---")
            with st.expander("🎞️ 녹화된 영상 보기", expanded=True):
                st.video(video_bytes)
                st.download_button(
                    "🎬 영상 다운로드",
                    video_bytes,
                    "recorded.mp4",
                    "video/mp4",
                    use_container_width=True
                )

# ------------------ 탭 2: 영상 업로드 ------------------
with tab2:
    with st.container():
        st.subheader("📤 영상 업로드")

        uploaded_file = st.file_uploader("MP4 파일을 선택하세요", type=["mp4"])
        if uploaded_file:
            if st.button("🚀 업로드", use_container_width=True):
                with st.spinner("서버로 업로드 중..."):
                    try:
                        files = {"file": (uploaded_file.name, uploaded_file, "video/mp4")}
                        res = requests.post(f"{FASTAPI_URL}/upload_video", files=files)
                        res.raise_for_status()
                        st.success(res.json()["message"])
                    except Exception as e:
                        st.error(f"업로드 실패: {e}")

# ------------------ 3D 생성 버튼 ------------------
st.markdown("---")

btn_col1, btn_col2 = st.columns([6, 1.6])
with btn_col2:
    if st.button("🌀 3D 영상 생성", use_container_width=True):
        with st.spinner("3D 데이터 처리 중..."):
            try:
                res = requests.post(f"{FASTAPI_URL}/get_latest_json")
                res.raise_for_status()
                json_data = res.json()
                status = send_to_unity(json_data)
                if status == 200:
                    st.success("✅ 유니티로 데이터 전송 완료!")
                else:
                    st.warning("⚠️ 유니티 응답 오류 발생")
            except Exception as e:
                st.error(f"3D 영상 생성 실패: {e}")

                
if st.button("📽 업로드된 영상 재생"):
    video_res = requests.get(f"{FASTAPI_URL}/get_latest_video")
    if video_res.status_code == 200:
        st.subheader("📹 업로드한 영상 미리보기")
        st.video(video_res.content)
    else:
        st.error("❌ 업로드된 영상이 없습니다.")
