export default () => ({
 
   // i18n 플러그인 설정
   i18n: {
    enabled: true, // i18n 플러그인 활성화
    config: {
      defaultLocale: 'ko', // 기본 언어 설정 (예: 영어)
      locales: ['ko' ,'en' ], // 지원할 언어 설정 (영어, 한국어)
    },
  },
 
});