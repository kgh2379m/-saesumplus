/**
 * 새숨더함 — 후기 API + 대표 답글 + 새 후기 알림
 *
 * 구글 시트(후기 응답 시트)에서 [확장 프로그램 > Apps Script]로 열어
 * 이 파일 내용으로 통째로 교체한 뒤, 웹 앱으로 "새 버전" 배포하세요.
 * (자세한 순서: apps-script/SETUP.md)
 *
 * ※ 이 파일을 GitHub 등에 올릴 때는 아래 OWNER_PIN 등 개인 값을 비워 두세요.
 */

const CONFIG = {
  // 대표 답글용 숫자 4자리 비밀번호 (반드시 본인 번호로 변경)
  OWNER_PIN: '0000',

  // 후기 응답이 쌓이는 시트 탭 이름. 비워두면 '첫 번째 탭'을 사용
  RESPONSES_SHEET: '',
  // 대표 답글이 저장될 탭 이름 (없으면 자동 생성)
  COMMENTS_SHEET: '대표답글',

  // ── 새 후기 알림 (쓰는 것만 채우세요. 비워두면 해당 알림은 건너뜀) ──
  NOTIFY_EMAIL: '',          // 예: 'me@gmail.com' → Gmail 앱 푸시로 폰에 알림
  TELEGRAM_BOT_TOKEN: '',    // 텔레그램 봇 토큰
  TELEGRAM_CHAT_ID: '',      // 내 텔레그램 chat id
  NTFY_TOPIC: '',            // ntfy 앱 주제 이름 (추측 어려운 긴 문자열 권장)

  SITE_URL: 'https://www.saesumplus.co.kr/#reviews',

  // 비밀번호 연속 실패 제한
  MAX_FAILS: 5,
  LOCK_MINUTES: 10
};

/* ───────────── 웹 앱: 읽기 ───────────── */
function doGet() {
  const sheet = getResponsesSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  const reviews = values
    .filter(function (r) { return r.some(function (c) { return c !== ''; }); })
    .map(function (r) {
      const o = {};
      headers.forEach(function (h, i) { o[h] = r[i]; });
      return o;
    });
  return json_({ reviews: reviews, comments: readComments_() });
}

/* ───────────── 웹 앱: 쓰기 (비밀번호 확인 / 답글 저장) ───────────── */
function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }

  const auth = checkPin_(String(body.pw || ''));
  if (auth !== 'ok') return json_({ ok: false, error: auth });

  if (body.action === 'verify') return json_({ ok: true });

  if (body.action === 'reply') {
    const reviewId = String(body.reviewId || '');
    const text = String(body.text || '').trim().slice(0, 500);
    if (!reviewId || reviewId.length > 64) return json_({ ok: false, error: 'bad_review' });
    return json_(saveComment_(reviewId, text));
  }

  return json_({ ok: false, error: 'unknown_action' });
}

/* ───────────── 새 후기 알림 (폼 제출 트리거) ───────────── */
function onFormSubmit(e) {
  const lines = [];
  const nv = (e && e.namedValues) || {};
  Object.keys(nv).forEach(function (k) {
    if (k === '타임스탬프') return;
    const v = String(nv[k] && nv[k][0] || '').trim();
    if (v) lines.push('■ ' + k.slice(0, 40) + '\n' + v.slice(0, 300));
  });
  const msg = '[새숨더함] 새 고객 후기가 등록되었습니다!\n\n' +
              lines.join('\n\n') + '\n\n답글 달기 👉 ' + CONFIG.SITE_URL;

  if (CONFIG.NOTIFY_EMAIL) {
    try { MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, '[새숨더함] 새 고객 후기가 등록되었습니다', msg); }
    catch (err) { console.error('email', err); }
  }
  if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID) {
    try {
      UrlFetchApp.fetch('https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'post',
        payload: { chat_id: CONFIG.TELEGRAM_CHAT_ID, text: msg }
      });
    } catch (err) { console.error('telegram', err); }
  }
  if (CONFIG.NTFY_TOPIC) {
    try {
      UrlFetchApp.fetch('https://ntfy.sh/' + encodeURIComponent(CONFIG.NTFY_TOPIC), {
        method: 'post',
        payload: msg,
        headers: { Title: 'New review', Priority: 'high', Click: CONFIG.SITE_URL }
      });
    } catch (err) { console.error('ntfy', err); }
  }
}

/** 최초 1회 직접 실행: 폼 제출 시 onFormSubmit이 자동 실행되도록 트리거 등록 */
function installTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onFormSubmit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ss).onFormSubmit().create();
}

/** 알림 설정 테스트용: 직접 실행하면 가짜 후기 알림이 발송됩니다 */
function testNotify() {
  onFormSubmit({ namedValues: { '소감': ['알림 테스트입니다.'], '성함': ['테스트'] } });
}

/* ───────────── 내부 함수 ───────────── */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getResponsesSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (CONFIG.RESPONSES_SHEET) return ss.getSheetByName(CONFIG.RESPONSES_SHEET);
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getName() !== CONFIG.COMMENTS_SHEET) return sheets[i];
  }
  return sheets[0];
}

function getCommentsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG.COMMENTS_SHEET);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.COMMENTS_SHEET);
    sh.getRange(1, 1, 1, 3).setValues([['reviewId', 'text', 'time']]);
    sh.getRange('A:C').setNumberFormat('@'); // 수식 오인 방지: 모두 텍스트로
  }
  return sh;
}

function readComments_() {
  const sh = getCommentsSheet_();
  const values = sh.getDataRange().getValues();
  values.shift();
  return values
    .filter(function (r) { return r[0] && r[1]; })
    .map(function (r) { return { reviewId: String(r[0]), text: String(r[1]), time: String(r[2]) }; });
}

function saveComment_(reviewId, text) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = getCommentsSheet_();
    const last = sh.getLastRow();
    let row = -1;
    if (last >= 2) {
      const ids = sh.getRange(2, 1, last - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === reviewId) { row = i + 2; break; }
      }
    }

    if (!text) { // 삭제
      if (row > 0) sh.deleteRow(row);
      return { ok: true, deleted: true };
    }

    const time = new Date().toISOString();
    if (row < 0) row = last + 1;
    const rng = sh.getRange(row, 1, 1, 3);
    rng.setNumberFormat('@');
    rng.setValues([[reviewId, text, time]]);
    return { ok: true, comment: { reviewId: reviewId, text: text, time: time } };
  } finally {
    lock.releaseLock();
  }
}

/** 'ok' | 'auth' | 'locked' */
function checkPin_(pw) {
  const cache = CacheService.getScriptCache();
  const fails = parseInt(cache.get('pin_fails') || '0', 10);
  if (fails >= CONFIG.MAX_FAILS) return 'locked';
  if (pw === String(CONFIG.OWNER_PIN)) {
    cache.remove('pin_fails');
    return 'ok';
  }
  cache.put('pin_fails', String(fails + 1), CONFIG.LOCK_MINUTES * 60);
  return 'auth';
}
