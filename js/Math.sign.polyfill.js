// A Math.sign polyfill for the internet explorer
// Source: http://pixijs.download/dev/coverage/src/polyfill/Math.sign.js.html

if (!Math.sign)
{
    Math.sign = function mathSign(x)
    {
        x = Number(x);
 
        if (x === 0 || isNaN(x))
        {
            return x;
        }
 
        return x > 0 ? 1 : -1;
    };
}
 
