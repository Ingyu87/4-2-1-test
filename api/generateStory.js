body {
    font-family: 'Inter', 'Noto Sans KR', sans-serif;
    background-color: #F0F9FF; /* 하늘색 배경 */
    overflow: hidden; /* 캐릭터가 화면 밖으로 나가지 않도록 */
}
.writing-textarea {
    @apply w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow shadow-sm;
}
.char-counter {
    @apply text-sm text-right text-gray-500 mt-1 font-medium;
}
.rubric-table {
    @apply w-full text-left border-collapse my-4;
}
.rubric-table th, .rubric-table td {
    @apply border border-gray-300 p-3;
}
.rubric-table th {
    @apply bg-sky-50 font-semibold;
}
.correction-original {
    color: red;
    font-weight: bold;
}
.correction-fixed {
    color: #2563EB;
    font-weight: bold;
}

/* 귀여운 배경 패턴 */
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: -1;
}

/* 배경 캐릭터 스타일 */
.background-character {
    position: fixed;
    z-index: -1;
    opacity: 0.9;
    transition: transform 0.3s ease-in-out;
    pointer-events: none; /* 캐릭터가 클릭 방해하지 않도록 */
}
.character-sprout { /* 새싹 캐릭터 */
    width: 180px;
    height: 180px;
    bottom: 10px;
    left: 20px;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUEUgAAAOEAAADhCAMAAAAJbSJIAAAAZlBMVEUAAAD////+/v78/Pz9/f329vb09PTu7u7v7+/w8PDs7Ozo6Ojj4+Ph4eHf39/d3d3a2trX19fV1dXU1NTR0dHPz8/MzMzLy8vKysrJycm/v7+9vb24uLiysrKtra2oqKinp6ejo6Ogg4O1AAAHiklEQVR4nO2di3qqMBCFRzNRcYwgiA/i4f//cIdAkrgESGxL2s77s+eyTzPpspuE/s4oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4JzVYtp1dG+2j7Qv345O649Vw7f59+M4gXk1Xf+GfndZ5zS/gG56uOXc3f/cE0uHxt2+fA4+c5lfx9Wc/k3n98tff/30P/EaW/Rqe/i9f3575uP52m1+d+wD4Q9yqW3rS/u82v/48wO/jD+jVv6P9r4bL7P8R+I38Y/r2t/fXzO+a+P3bZ4DvpG+zvy4+z/xfBf/8+f1V8z/i/e/85a/p/lfV/gN4/72G+x+5+4PvkT/I36Z/zfx++eubX38e4NfxZ/Trf2P7t9n8qvnr8Z/5fV38P3T2v/sH+Bf8Gf37u/tX0/2P/AH+Tf769p+V/xG+Bf8b3P+b+R/x+/tX0/2X/B/wnwn/a/j/5R/wnwn/s/k/+f3tPws/wn+E//V8f/7x83/H+Cf8T/3/1P+X/wn/M/8P5n/k98v/n/N/+P/+E/5v3X/2/wD+C/+r6v4H/B/wn/l/8v/l/8f4F/5X3f0P/A/4V/0/3P1I/wn/s/mf+T3y/5f/Q/4V/9fV/0P+F/6n/p/f/8D/kf/8/Q/4P/D/+v+b/wn/m/N/8vsf+b/0/+H/w//m/VfV/wH+Ff9X8/8G/g/+j+b/w/+H/w//X/lf/T8//wH/p/7f2/+U/8H/0fxf2/+Q/1P/f23/G/6vnv+b/w//o/lf2/+E/+n+f23/Fv5fz/8A/w/+j+b/w/8H/0fz/6n+f2X/Fv4vnn8A/w/+r57/G/if+v+1/S/8vnn++P/w/5f+P+Z/wP+w+p/bv8E/4n/V/P/4f/L/6/5H/E/KP+X9v9m/wn/l/N/8vvtfwv/A/4f/l9X/4/wv/T/5P/b/yP+5/6f83/w+8v/n/lf+V+V/4v43/K/8v+A/6n/5/d/8vvL/8v5n/hfu3+b/yP+R/zP/X/z/4v53/n/nf+r/L/5P+V/5X5d/G/+r+Z/5ffL/5/zv/l/+X8f/zP/X/l/8/8r87/y/yv/L+f/4vfb/8f8r/yvzr/L/Kv8v+5/wP/8/235V/v9F/M/8v/x/yn/Q/8v87/k/6v3//J76P/V+l/5v1P/L/t/mv+//L/+Z/xP/S/+v83/V+n/Vf/fV//f1f/X/T9X/0/1/1X/r6v/vyr/vx7/v8r/rxL/v+b/l/p/sv9X+/+y/1f7/7L/V/v/sv9X+/+y/1f7/8v+v0T+v9n/1wT/r5P/Xyr/v/b/F/p/X/5/5f8X+v+/9n8j/n/9/+H+X8n/X+/9n4j/X+/+z/1/kv/fWv6v2v6v2v4X+39v+b+S/+f2/5P+P7X/j/l/lf9ftf9f9f9V+f/V+V+Z/9fZ/1dl/9fp/6v0/yr9vwL/vyL/n+z/p/s/6f5P+v/J/p/t/8D+/wT/X+X/V+V/5P/L/h/mf+P+R/5f5X9d/n/l/8v+Z/xf5f/L/hf5/zL/T/lfmf8X+V+b/w/z/2H+P/L/Yf4/8v+A/5P/H+Z/4/6P+f+R/x/p/zP/H+X/4f9n+v/5/4v5f8H/R/4/8v/H/H/Z/7/6P+B/3/0/0D/Z/5/7P+B/y//H+R/4f+L+P+h/w/zv2b+Z/x//P/o/0H/h/lfmf83/1/lf2H+/+h/5P9D/w/zvzH/P+H/Yf5/4v/J/w/zvzH/b+j/Qv8n/h/mf2H+n+h/Zf9f9n/A/8r+gvzf0v/H/H/Z/1f/n/k/1P+H/V/Y/+v8D+i/gvzP9D/S/z/yP+b/B/o/zL/O/J/oP8D+t/If3n/B+r/Rvyv/N9+/9n//8/V+T9X/6X+p/8f8L93/v8D+P/w/9X5X9r+7wz/B+z/0//P+L+n/7+W/c84/4f5f8b/7/V/1fz/xPxfWf4v6n/L/lfV/yP/b8z/w//P/P+w/3/W/5X9r9b/R/6/nP+B/5f9r5n/gf/X+F/b/2v/B+x/pP8L+T/L/vflv6P9r+V/Vf9f9n/B/6H/x/g/0//v8v9r+Z+9/wn/n/1/oP/79X+x/wPyf7n/l/s/1v+L+N+Z/wvy/z7/J//f7f9X7T97/xPzf2P+l+V/av9f878w/0/kfzX+3/3/r/w/rf+V/W+L+F/a/1fV/5H/5/c/8v/R+d/Y/wX/x/Y/83+B/w/zv7L/G/mfyP/I/w/yvy7/t/J/rv/v8n+Z/5f539n/hfmfyX+9/lf3P+B/wf5X8L/t/Nfsv8z+l9T/8v9n9j/gv2Hyf/L/Z8L/9/qf2f8X+F+f/5v8H+5/Rv7X8n9y/lf0/+X+D/a/YP8n+V/T/5f7n8v/p/tfzH93/lfmfwD/h/lflP83/1/0v5L/p/o/mf/J/lfkv+z/gv7/5L9m/j9y/0D/x/Y/MP/X2f8F/l/mf9z+v/L/If/3+l9H/r/q/478j+p/nPkf+B/X/wv+L+d/x/7H5X83/8vyP+b/Rvyv1/9a/mvyP6L/H+f/S/rfov6n9//+/3P/5/o/o/8v9z/lvyPyf43+R+X/9vy35X+j8r/v/N/ov9f87+F/P/c/wX/t/Pfq/+Z/Pfqf6H+L+Z/pv1X/o/Nfq/+J+R/zPzL/C/M/Mf8b+v/M/lf0/yH5nxz/jfmfy/9X7X8A77/T/w+K+K+G+2/4//7zHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8J/1/6TzFzX6f/WRAAAAAElFTkSuQmCC');
    background-size: contain;
    background-repeat: no-repeat;
}
.character-cat {
    width: 120px;
    height: 120px;
    top: 50px;
    right: 30px;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cg%3E%3Cpath fill="%23A9A9A9" d="M50 25 A25 25 0 0 1 50 75 A25 25 0 0 1 50 25 Z"/%3E%3Cpath d="M40 25 L30 10 L45 20 Z" fill="%23A9A9A9"/%3E%3Cpath d="M60 25 L70 10 L55 20 Z" fill="%23A9A9A9"/%3E%3Ccircle fill="%23000000" cx="42" cy="45" r="4"/%3E%3Ccircle fill="%23000000" cx="58" cy="45" r="4"/%3E%3Cpath d="M48 55 Q50 60 52 55" stroke="%23000000" stroke-width="2" fill="none"/%3E%3Cpath d="M30 50 L20 50 M30 55 L20 55 M30 60 L20 60" stroke="%23000000" stroke-width="1.5"/%3E%3Cpath d="M70 50 L80 50 M70 55 L80 55 M70 60 L80 60" stroke="%23000000" stroke-width="1.5"/%3E%3C/g%3E%3C/svg%3E');
    background-size: contain;
    background-repeat: no-repeat;
}

#app:hover .background-character {
    transform: scale(1.1);
}
