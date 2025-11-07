export const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const passwordPattern =
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const textPattern = /^(.*)$/;

export const alphaNumberPattern = /^[A-Za-z0-9]*$/;

export const urlPattern =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

export const htmlPattern = /<[^>]+>/;
