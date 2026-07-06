# streamlit run streamlit_app.py
from __future__ import annotations

import time
from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

from game import Puzzle, generate_puzzle, normalize
from motor import Motor

# --- Klasör Yolları Tanımlamaları ---
DEFAULT_FOLDER = Path(__file__).parent / "Turkce-Kelime-Listesi"
DEFAULT_DAR_FOLDER = Path(__file__).parent / "dar_list"  # Yeni dar klasör yolu

_TURKISH_UPPER_MAP = str.maketrans({
    "i": "İ", "ı": "I", "ş": "Ş", "ç": "Ç", "ğ": "Ğ", "ü": "Ü", "ö": "Ö"
})

@st.cache_resource
def load_motor() -> Motor:
    # Geniş sözlük ve dar sözlük yükleniyor
    return Motor(DEFAULT_FOLDER, DEFAULT_DAR_FOLDER)

def display_word(word: str) -> str:
    return word.translate(_TURKISH_UPPER_MAP).upper()

def initialize_state() -> None:
    if "motor" not in st.session_state:
        st.session_state.motor = load_motor()
        
    if "puzzle" not in st.session_state:
        puzzle = generate_puzzle(st.session_state.motor)
        st.session_state.puzzle = puzzle
        st.session_state.entered_words = [normalize(puzzle.start)]
        st.session_state.game_over = False
        st.session_state.time_expired = False
        st.session_state.error_msg = ""
        st.session_state.deadline = time.time() + 8.0 
        st.session_state.show_plus_7 = False
    if "shake_counter" not in st.session_state:
        st.session_state.shake_counter = 0

def reset_game() -> None:
    puzzle = generate_puzzle(st.session_state.motor)
    st.session_state.puzzle = puzzle
    st.session_state.entered_words = [normalize(puzzle.start)]
    st.session_state.game_over = False
    st.session_state.time_expired = False
    st.session_state.error_msg = ""
    st.session_state.deadline = time.time() + 8.0
    st.session_state.show_plus_7 = False
    st.session_state.shake_counter = 0
    st.rerun()

# --- Sayfa Ayarları (Kompakt Mod) ---
st.set_page_config(page_title="Kelime Zinciri", page_icon="⏱️", layout="centered")

# --- CSS Ayarları ---
st.markdown("""
    <style>
        .block-container {
            padding-top: 1.5rem !important;
            padding-bottom: 0rem !important;
            max-width: 550px !important;
        }
        h1 { font-size: 1.8rem !important; margin-bottom: 0.2rem !important; padding-bottom: 0rem !important; }
        h3 { font-size: 1.1rem !important; margin-top: 0.5rem !important; margin-bottom: 0.3rem !important; }
        .wordle-tile {
            display: inline-block; background-color: #f0f2f5; border: 2px solid #d3d6da;
            color: #1a1a1a; border-radius: 4px; font-weight: bold; font-size: 1rem;
            padding: 4px 10px; margin: 2px; text-align: center; letter-spacing: 0.5px;
        }
        .wordle-tile-start { background-color: #4caf50; color: white; border-color: #4caf50; }
        .wordle-tile-target { background-color: #2196f3; color: white; border-color: #2196f3; }
        .chain-arrow { color: #888; font-weight: bold; font-size: 1rem; margin: 0 2px; }
        hr { margin: 0.6rem 0 !important; }
        .stTextInput label { font-size: 0.9rem !important; padding-bottom: 0.2rem !important; }
        
        /* TİTREME (SHAKE) ANİMASYONU */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        /* Streamlit text-input alanını hedefleyen dinamik sınıflar */
        .shake-active div[data-testid="stTextInput"] {
            animation: shake 0.5s ease-in-out;
            border: 1px solid #f44336 !important;
            border-radius: 4px;
        }
    </style>
""", unsafe_allow_html=True)

initialize_state()

puzzle = st.session_state.puzzle
entered_words = st.session_state.entered_words
motor = st.session_state.motor

# --- +7 SANİYE GÖRSEL ANİMASYONU ---
if st.session_state.get("show_plus_7", False):
    st.markdown(
        """
        <div style="position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%);
                    font-size: 3.5rem; font-weight: 900; color: #4caf50; 
                    text-shadow: 2px 2px 5px rgba(0,0,0,0.4);
                    animation: fadeup 1.2s ease-out forwards; z-index: 9999; pointer-events: none;">
            +7 Saniye!
        </div>
        <style>
            @keyframes fadeup {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
                30% { opacity: 1; transform: translate(-50%, -70%) scale(1.1); }
                100% { opacity: 0; transform: translate(-50%, -120%) scale(1.2); }
            }
        </style>
        """, unsafe_allow_html=True
    )
    st.session_state.show_plus_7 = False

# --- BAŞLIK ---
st.title("⏱️ Kelime Zinciri: Zamana Karşı")
st.write("---")

# --- GÖREV KUTULARI ---
col1, col2 = st.columns(2)
with col1:
    st.markdown(f"**Başlangıç:** <span class='wordle-tile wordle-tile-start'>{display_word(puzzle.start)}</span>", unsafe_allow_html=True)
with col2:
    st.markdown(f"**Hedef:** <span class='wordle-tile wordle-tile-target'>{display_word(puzzle.target)}</span>", unsafe_allow_html=True)

# --- OYNANAN KELİMELER ---
st.subheader("🔗 Zincirin")
chain_html = ""
for i, word in enumerate(entered_words):
    if i == 0:
        chain_html += f"<span class='wordle-tile wordle-tile-start'>{display_word(word)}</span>"
    else:
        chain_html += f"<span class='chain-arrow'>→</span><span class='wordle-tile'>{display_word(word)}</span>"

st.markdown(f"<div>{chain_html}</div>", unsafe_allow_html=True)
st.write("---")

# --- OYUN DURUM KONTROLÜ (KAZANMA / KAYBETME / OYNAMA) ---
if st.session_state.game_over:
    st.balloons()
    user_connected_count = len(entered_words) - 1
    st.success(f"🎉 Harika! {user_connected_count} kelime bağlayarak hedefe ulaştın ve zamanı yendin.")
    if st.button("Yeniden Oyna 🔄", type="primary", use_container_width=True, key="btn_win_reset"):
        reset_game()

elif st.session_state.time_expired:
    st.error("⏳ SÜRE BİTTİ! Yeterince hızlı olamadın.")
    user_connected_count = len(entered_words) - 1
    st.info(f"Zincir koptu... ")
    if st.button("Yeniden Oyna 🔄", type="primary", use_container_width=True, key="btn_lose_reset"):
        reset_game()

else:
    # --- GERİ SAYIM KONTROLÜ VE GÖRSEL BAR (JS) ---
    time_left = st.session_state.deadline - time.time()
    
    if time_left <= 0:
        st.session_state.time_expired = True
        st.rerun()
        
    components.html(
        f"""
        <div id="timer-container" style="background-color: #e0e0e0; border-radius: 6px; width: 100%; height: 26px; position: relative; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);">
            <div id="timer-bar" style="background-color: #4caf50; width: 100%; height: 100%; transition: background-color 0.2s, width 0.05s linear;"></div>
            <div id="timer-text" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-weight: bold; font-size: 15px; color: #111; text-shadow: 1px 1px 2px rgba(255,255,255,0.7);">
                {time_left:.1f}s
            </div>
        </div>
        <script>
            var timeLeft = {time_left};
            var maxTime = Math.max(timeLeft, 7.0); 
            var startTime = performance.now();
            var timerBar = document.getElementById("timer-bar");
            var timerText = document.getElementById("timer-text");
            
            var interval = setInterval(function() {{
                var elapsed = (performance.now() - startTime) / 1000;
                var currentLeft = timeLeft - elapsed;
                
                if (currentLeft <= 0) {{
                    currentLeft = 0;
                    clearInterval(interval);
                    timerBar.style.width = "0%";
                    timerBar.style.backgroundColor = "#f44336";
                    timerText.innerText = "SÜRE BİTTİ!";
                    timerText.style.color = "white";
                    timerText.style.textShadow = "none";
                    
                    var parentDoc = window.parent.document;
                    var submitBtn = parentDoc.querySelector('button[data-testid="stFormSubmitButton"]');
                    
                    if (!submitBtn) {{
                        var buttons = parentDoc.querySelectorAll('button');
                        buttons.forEach(function(btn) {{
                            if (btn.textContent && btn.textContent.includes("Kelimeyi Ekle")) {{
                                submitBtn = btn;
                            }}
                        }});
                    }}
                    
                    if (submitBtn) {{
                        submitBtn.click();
                    }}
                }} else {{
                    var pct = (currentLeft / maxTime) * 100;
                    timerBar.style.width = Math.min(pct, 100) + "%";
                    timerText.innerText = currentLeft.toFixed(1) + "s";
                    
                    if (currentLeft <= 3.5) {{
                        timerBar.style.backgroundColor = "#ff9800";
                    }}
                    if (currentLeft <= 1.5) {{
                        timerBar.style.backgroundColor = "#f44336";
                        timerText.style.color = "white";
                        timerText.style.textShadow = "none";
                    }}
                }}
            }}, 50);

            function setFocus() {{
                var parentDoc = window.parent.document;
                var input = parentDoc.querySelector('input[placeholder="Yazın ve Enter\\'a basın..."]');
                if (input && !input.disabled) {{
                    input.focus();
                }}
            }}
            setTimeout(setFocus, 50);
            setTimeout(setFocus, 150);
        </script>
        """,
        height=35,
    )

    if st.session_state.error_msg:
        st.error(st.session_state.error_msg)
        
    # --- Form Alanı (Tek Bir `key="game_form"` olarak Birleştirildi) ---
    shake_class = "shake-active" if st.session_state.error_msg else ""
    st.markdown(f'<div class="{shake_class}">', unsafe_allow_html=True)
    
    with st.form(key="game_form", clear_on_submit=True):
        current_input = st.text_input(
            label=f"Sıradaki kelime '{display_word(entered_words[-1][-1])}' harfiyle başlamalı:",
            placeholder="Yazın ve Enter'a basın...",
            max_chars=20
        )
        submit_btn = st.form_submit_button("Kelimeyi Ekle", use_container_width=True)
        
    st.markdown('</div>', unsafe_allow_html=True)

    # --- KELİME GİRİŞİ YAKALAMA VE SÜRE KONTROLÜ ---
    if submit_btn or current_input:
        if time.time() > st.session_state.deadline:
            st.session_state.time_expired = True
            st.rerun()
            
        next_word = normalize(current_input) if current_input else ""
        previous_word = entered_words[-1]
        
        if not next_word:
            pass 
        elif not motor.contains(next_word): 
            st.session_state.error_msg = f"'{display_word(next_word)}' sözlükte bulunamadı!"
            st.session_state.shake_counter += 1
            st.rerun()
        elif next_word in entered_words:
            st.session_state.error_msg = f"'{display_word(next_word)}' kelimesini zaten kullandınız."
            st.session_state.shake_counter += 1
            st.rerun()
        elif next_word[0] != previous_word[-1]:
            st.session_state.error_msg = f"Kelime '{display_word(previous_word[-1])}' harfiyle başlamalı!"
            st.session_state.shake_counter += 1
            st.rerun()
        else:
            st.session_state.entered_words.append(next_word)
            st.session_state.error_msg = "" 
            
            if next_word[-1] == normalize(puzzle.target)[0]:
                st.session_state.game_over = True
            else:
                st.session_state.deadline += 7.0
                st.session_state.show_plus_7 = True 
            
            st.rerun()