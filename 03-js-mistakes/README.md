# 10 أخطاء JavaScript بيقع فيها المبتدئين

كود فيديو [10 أخطاء JavaScript](https://www.youtube.com/@WatchNdCode) على قناة Watch & Code.

كل الأخطاء في ملف واحد: [`mistakes.js`](mistakes.js). كل غلطة فيها الكود الغلط ونتيجته (❌)، وبعده الحل (✅).

## جرّبها إزاي
افتح أي صفحة في Chrome، دوس **F12** ⬅ **Console**، وانسخ الغلطة اللي عايز تجربها.
(الغلطة 3 محتاجة صفحة HTML فيها زرار، فهي مكتوبة كتعليق.)

| # | الغلطة | الحل |
|---|---|---|
| 1 | `"5" + 3` = `"53"` | `Number(price)` |
| 2 | `==` | `===` |
| 3 | `querySelector` بيرجّع `null` | `defer` |
| 4 | `map` من غير `return` | `(p) => p * 2` |
| 5 | نسيت `await` | `await getCity(...)` |
| 6 | `var` جوه loop | `let` |
| 7 | نسخ object بـ `=` | `{ ...user }` |
| 8 | `sort()` للأرقام | `sort((a, b) => a - b)` |
| 9 | `if (cart)` مع array فاضي | `cart.length > 0` |
| 10 | `0.1 + 0.2 !== 0.3` | `toFixed(2)` و `Number.EPSILON` |
