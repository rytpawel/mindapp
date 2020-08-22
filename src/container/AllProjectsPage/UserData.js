
import React, { Component } from 'react';

export const request = async (url) => {
    try {
      const response = await fetch(url, {mode: 'no-cors'});
      
          return response;
      
      
     
    }
    catch (e) {
      console.log('We have the error', e);
    }
  }
  
