// @flow

import styled from 'styled-components';
import type { ComponentType } from 'react';


export const OverlayContainer: ComponentType<*> = (() => {
  return styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  background: transparent;
  z-index: 1234567;
   `;
})();

export const InlineContainer: ComponentType<*> = (() => {
  return styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
  `;
})();


export const Link: ComponentType<*> = (() => {
  return styled.a`
  background: rgba(255, 255, 255, .8); 
  padding: .5em .5em 2em .5em; 
  `;
})();
