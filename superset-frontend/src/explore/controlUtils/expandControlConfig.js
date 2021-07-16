import React from 'react';
import sharedControlComponents from '@superset-ui/chart-controls/lib/shared-controls/components';
import { controls as customizeControls } from '../controls';

export function expandControlType(controlType) {
  if (
    typeof controlType === 'string' &&
    controlType in sharedControlComponents
  ) {
    return sharedControlComponents[controlType];
  }
  return controlType;
}

export function expandControlConfig(control, controlOverrides = {}) {
  // one of the named shared controls
  if (typeof control === 'string' && control in customizeControls) {
    const name = control;
    return {
      name,
      config: { ...customizeControls[name], ...controlOverrides[name] },
    };
  } // JSX/React element or NULL

  if (
    !control ||
    typeof control === 'string' ||
    /* #__PURE__ */ React.isValidElement(control)
  ) {
    return control;
  } // already fully expanded control config, e.g.

  if ('name' in control && 'config' in control) {
    return {
      ...control,
      config: {
        ...control.config,
        type: expandControlType(control.config.type),
      },
    };
  } // apply overrides with shared controls

  if ('override' in control && control.name in customizeControls) {
    const { name, override } = control;
    return {
      name,
      config: { ...customizeControls[name], ...override },
    };
  }

  return null;
}