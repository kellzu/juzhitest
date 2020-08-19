import request from '@/utils/request'

export function resetPasswordEmail(data) {
  return request({
    url: '/admin/send/reset-password-email',
    method: 'post',
    data: data,
  });
}

export function resetPassword(data) {
  return request({
    url: '/admin/reset-password',
    method: 'post',
    data: data,
  });
}