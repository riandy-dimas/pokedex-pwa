import React, { useState } from 'react';
import { TPokemonType } from '../../interfaces/pokemon';
import './styles.css';

type TTabs = {
  tabs: {
    tabName: string
    tabContent: React.ReactNode
  }[],
  accentType: TPokemonType
}
const Tabs = ({
  tabs,
  accentType,
}: TTabs) => {
  const [active, setActive] = useState<string>(tabs[0].tabName);

  return <div className='tabs'>
    <div className='tabs__buttons'>
    {
      tabs.map(({ tabName }, idx) => <button key={`tab-${tabName}-${idx}`} id={`tab-${tabName}-${idx}`} className={`tabs__tab-button tabs__tab-button--${accentType} color color--${accentType}`} aria-selected={active === tabName} onClick={() => setActive(tabName)} aria-controls={`panel-${tabName}`} role='tab'>{ tabName }</button>)
    }
    </div>
    <div className='tabs__contents'>
    {
      tabs.map(({ tabName, tabContent }, idx) => <div key={`panel-${tabName}-${idx}`} id={`panel-${tabName}-${idx}`} className="tabs__panel" aria-hidden={active !== tabName} aria-labelledby={`tab-${tabName}`} role="tabpanel">
        { tabContent }
      </div>)
    }
    </div>
  </div>;
};

export default Tabs;
