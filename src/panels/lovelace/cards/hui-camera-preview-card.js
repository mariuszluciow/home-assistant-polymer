import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import computeDomain from '../../../common/entity/compute_domain.js';

import '../../../cards/ha-camera-card.js';
import './hui-error-card.js';

class HuiCameraPreviewCard extends PolymerElement {
  static get properties() {
    return {
      hass: {
        type: Object,
        observer: '_hassChanged',
      },
      config: {
        type: Object,
        observer: '_configChanged',
      }
    };
  }

  getCardSize() {
    return 4;
  }

  _configChanged(config) {
    this._entityId = null;
    if (this.lastChild) {
      this.removeChild(this.lastChild);
    }
    const entityId = config && config.entity;
    if (entityId && !(entityId in this.hass.states)) {
      return;
    }

    let error = null;
    let cardConfig;
    let tag;

    if (entityId) {
      if (computeDomain(entityId) === 'camera') {
        this._entityId = entityId;
        tag = 'ha-camera-card';
        cardConfig = config;
      } else {
        error = 'Entity domain must be "camera"';
      }
    } else {
      error = 'Entity not defined in card config';
    }

    if (error) {
      tag = 'hui-error-card';
      cardConfig = { error };
    }
    const element = document.createElement(tag);

    if (!error) {
      element.stateObj = this.hass.states[entityId];
      element.hass = this.hass;
    }

    element.config = cardConfig;
    this.appendChild(element);
  }

  _hassChanged(hass) {
    if (this.lastChild && this._entityId && this._entityId in hass.states) {
      const element = this.lastChild;
      const stateObj = hass.states[this._entityId];
      element.stateObj = stateObj;
      element.hass = hass;
    } else {
      this._configChanged(this.config);
    }
  }
}

customElements.define('hui-camera-preview-card', HuiCameraPreviewCard);
