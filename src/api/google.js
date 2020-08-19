import ajax from '@/utils/ajax'
const googleApiUrl = 'https://translate.googleapis.com/translate_a/single';

export function transZh2En(name) {
  const params = new URLSearchParams();
  params.append('client', 'gtx');
  params.append('sl', 'zh');
  params.append('tl', 'en');
  params.append('dt', 't');
  params.append('q', name);
  // XMLHttpRequest 对象
  return ajax('get', googleApiUrl, params);
}