export default function concatURLs(url1, url2) {
    return `${url1.replace(/\/*$/, "/")}${url2}`;
}