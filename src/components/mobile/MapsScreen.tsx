import { useLanguage } from '../../contexts/LanguageContext';
import { StoresMap } from '../browser/StoresMap';

export function MapsScreen() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return <StoresMap isEn={isEn} />;
}
