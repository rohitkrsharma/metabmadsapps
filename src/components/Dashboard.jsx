import React, { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <>
      <div>{t("dashboard")}</div>
    </>

  )
};

export default Dashboard;
