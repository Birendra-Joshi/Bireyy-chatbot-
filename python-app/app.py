import os

import requests
import streamlit as st
from dotenv import load_dotenv

st.set_option("client.showSidebarNavigation", False)

load_dotenv()

INSTRUCTION = """
You are an AI chatbot named Bireyy. You are helpful, friendly, and sometimes playful.
- Don't mention your name unless explicitly asked.
- If someone asks for your name, respond with "I'm Bireyy!" or something casual.
- Keep your responses friendly and conversational.
- You respect and love your developer Birendra.
"""

MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
QUICK_PROMPTS = [
    "Explain this like I am twelve",
    "Help me write a polished email",
    "Suggest five creative ideas for a side project",
]

CHAT_HISTORY = [
    {
        "id": "1",
        "title": "Product ideas",
        "preview": "Help me frame a better launch plan",
        "prompt": "Help me come up with a product idea for a simple app that solves a common everyday problem.",
    },
    {
        "id": "2",
        "title": "Writing help",
        "preview": "Polish a short introduction",
        "prompt": "Help me write a polished introduction for a short project proposal.",
    },
    {
        "id": "3",
        "title": "Quick notes",
        "preview": "Summarize this in simple terms",
        "prompt": "Turn these rough notes into clear, concise bullet points.",
    },
]


def create_prompt(user_message: str, response_style: str) -> str:
    style_note = {
        "friendly": "Be friendly, conversational, and supportive.",
        "concise": "Keep your reply brief and direct.",
        "creative": "Be imaginative, vivid, and helpful.",
    }[response_style]
    return f"{INSTRUCTION}\n{style_note}\nUser: {user_message}\nAI:"


def get_bot_reply(user_message: str, response_style: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "Please set GEMINI_API_KEY or GOOGLE_API_KEY in your environment before chatting."

    payload = {
        "contents": [{"parts": [{"text": create_prompt(user_message, response_style)}]}]
    }
    response = requests.post(
        f"{MODEL_URL}?key={api_key}",
        json=payload,
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")


st.set_page_config(page_title="Bireyy Python", page_icon="🤖", layout="wide")

st.markdown(
    """
    <style>
    .stApp { background: #ffffff; color: #111111; }
    section[data-testid="stSidebar"] { background: #ffffff; border-right: 1px solid #e5e7eb; }
    .block-container { padding-top: 1rem; padding-bottom: 1rem; }
    div[data-testid="stChatMessage"] { border: 1px solid #e5e7eb; border-radius: 16px; padding: 0.75rem 1rem; background: #ffffff; box-shadow: 0 1px 2px rgba(17, 17, 17, 0.04); }
    .stButton > button, .stTextInput > div > div > input { border: 1px solid #d1d5db; border-radius: 12px; color: #111111; background: #ffffff; }
    .stButton > button:hover { border-color: #111111; color: #111111; }
    .stRadio > div { color: #111111; }
    </style>
    """,
    unsafe_allow_html=True,
)

if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "Hello! How can I make your day better today?",
        }
    ]
if "response_style" not in st.session_state:
    st.session_state.response_style = "friendly"
if "active_chat" not in st.session_state:
    st.session_state.active_chat = "1"

with st.sidebar:
    st.markdown("<div style='display:flex; align-items:center; gap:10px; margin-bottom:18px;'>"
                "<div style='width:40px; height:40px; border-radius:14px; background:#111111; display:flex; align-items:center; justify-content:center; color:white;'>🤖</div>"
                "<div><div style='font-weight:700; font-size:16px; color:#111111;'>Bireyy</div><div style='font-size:13px; color:#6b7280;'>AI assistant</div></div>"
                "</div>", unsafe_allow_html=True)

    if st.button("New chat", use_container_width=True):
        st.session_state.messages = [
            {
                "role": "assistant",
                "content": "A fresh conversation is ready. What would you like to explore?",
            }
        ]
        st.session_state.response_style = "friendly"
        st.session_state.active_chat = ""
        st.rerun()

    st.markdown("<div style='margin-top:14px; margin-bottom:6px; font-size:13px; font-weight:700; color:#111111;'>Conversations</div>", unsafe_allow_html=True)
    for item in CHAT_HISTORY:
        clicked = st.button(item["title"], key=f"chat_{item['id']}")
        st.caption(item["preview"])
        if clicked:
            st.session_state.active_chat = item["id"]
            # add the prompt as a user message and fetch a reply
            st.session_state.messages.append({"role": "user", "content": item["prompt"]})
            try:
                with st.spinner("Bireyy is thinking..."):
                    reply = get_bot_reply(item["prompt"], st.session_state.response_style)
                st.session_state.messages.append({"role": "assistant", "content": reply})
            except Exception as exc:  # noqa: BLE001
                st.session_state.messages.append({"role": "assistant", "content": f"Error: {exc}"})
            st.rerun()

    st.markdown("<div style='margin-top:16px; margin-bottom:8px; font-size:13px; font-weight:600; color:#111111;'>Response style</div>", unsafe_allow_html=True)
    st.session_state.response_style = st.radio(
        "",
        ["friendly", "concise", "creative"],
        index=["friendly", "concise", "creative"].index(st.session_state.response_style),
        horizontal=True,
    )

    st.markdown("<div style='margin-top:16px; margin-bottom:8px; font-size:13px; font-weight:600; color:#111111;'>Quick prompts</div>", unsafe_allow_html=True)
    for prompt in QUICK_PROMPTS:
        if st.button(prompt, use_container_width=True, key=f"prompt_{prompt}"):
            st.session_state.messages.append({"role": "user", "content": prompt})
            try:
                with st.spinner("Bireyy is thinking..."):
                    reply = get_bot_reply(prompt, st.session_state.response_style)
                st.session_state.messages.append({"role": "assistant", "content": reply})
            except Exception as exc:  # noqa: BLE001
                st.session_state.messages.append({"role": "assistant", "content": f"Error: {exc}"})
            st.rerun()

main_col, _ = st.columns([4, 1])
with main_col:
    st.markdown(
        "<div style='display:flex; justify-content:space-between; align-items:center; padding:0 4px 12px 4px;'>"
        "<div><div style='font-size:13px; color:#6b7280;'>Current chat</div><div style='font-size:22px; font-weight:700; color:#111111;'>Bireyy</div></div>"
        "<div style='padding:8px 10px; border:1px solid #e5e7eb; border-radius:12px; color:#111111;'>✨</div>"
        "</div>",
        unsafe_allow_html=True,
    )

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])

    user_input = st.chat_input("Message Bireyy...")
    if user_input:
        st.session_state.messages.append({"role": "user", "content": user_input})
        with st.chat_message("user"):
            st.write(user_input)

        try:
            with st.spinner("Bireyy is thinking..."):
                reply = get_bot_reply(user_input, st.session_state.response_style)
        except Exception as exc:  # noqa: BLE001
            reply = f"Error: {exc}"

        st.session_state.messages.append({"role": "assistant", "content": reply})
        with st.chat_message("assistant"):
            st.write(reply)
        st.rerun()
