import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core';
import { mergeStyles } from '../utilities';
import { commonStyles, fullLogoStyles } from '../muiTheme';

const styles = mergeStyles(fullLogoStyles, commonStyles);

interface Props extends WithStyles<typeof styles> { }

const FullLogoBase = function(props: Props) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="1203"
            height="200"
        >
            <rect 
                id="backgroundrect"
                width="100%"
                height="100%"
                x="0" y="0"
                fill="none"
                stroke="none"
            /> 
            <g className="currentLayer">
                <g id="svg_8">
                    <path 
                        fill="#ffc107"
                        fillOpacity="1"
                        stroke="#ffffff"
                        strokeWidth="5"
                        strokeDasharray="none"
                        strokeLinejoin="round"
                        strokeLinecap="butt"
                        strokeDashoffset=""
                        fillRule="nonzero"
                        opacity="1"
                        markerStart=""
                        markerMid=""
                        markerEnd=""
                        d="M543.6675218181128,83.10612183545186 C543.6675218181128,40.287641106369364 577.8222322088119,5.604671715812515 619.9885413331319,5.604671715812515 C662.154850457452,5.604671715812515 696.3095608481514,40.287641106369364 696.3095608481514,83.10612183545186 C696.3095608481514,125.92460256453433 662.154850457452,160.6075719550912 619.9885413331319,160.6075719550912 C577.8222322088119,160.6075719550912 543.6675218181128,125.92460256453433 543.6675218181128,83.10612183545186 z"
                        id="svg_9"
                        strokeOpacity="1"
                    />
                    <path 
                        fill="#3f51b5"
                        fillOpacity="1"
                        stroke="#ffffff"
                        strokeWidth="11"
                        strokeDasharray="none"
                        strokeLinejoin="round"
                        strokeLinecap="butt"
                        strokeDashoffset=""
                        fillRule="nonzero"
                        opacity="1"
                        markerStart=""
                        markerMid="" 
                        markerEnd=""
                        d="M502.2361008263313,118.70487404351587 C502.2361008263313,75.88639331443338 536.3908112170307,41.20342392387653 578.5571203413506,41.20342392387653 C620.7234294656706,41.20342392387653 654.87813985637,75.88639331443338 654.87813985637,118.70487404351587 C654.87813985637,161.52335477259828 620.7234294656706,196.20632416315516 578.5571203413506,196.20632416315516 C536.3908112170307,196.20632416315516 502.2361008263313,161.52335477259828 502.2361008263313,118.70487404351587 z"
                        id="svg_10"
                        strokeOpacity="1"
                    />
                </g>
                <foreignObject 
                    fill=""
                    strokeDashoffset=""
                    fillRule="nonzero"
                    fontSize="200"
                    fontFamily="Roboto Mono"
                    letterSpacing="0"
                    wordSpacing="0"
                    markerStart=""
                    markerMid=""
                    markerEnd=""
                    id="svg_1"
                    x="1.417571783065796"
                    y="2.2398014068603516"
                    width="1204.1630859375"
                    height="203.2346954345703"
                    className={props.classes.blackColor}
                >
                    <p>
                        <p className={props.classes.text}>Andr  meda</p>
                    </p>
                </foreignObject>
            </g>
            <defs>
                <filter id="f108" colorInterpolationFilters="sRGB">
                    <feGaussianBlur result="result0" in="SourceAlpha" stdDeviation="6" />
                    <feSpecularLighting specularExponent="25" specularConstant="1" surfaceScale="10" lightingColor="#fff" result="result1" in="result0">
                        <feDistantLight azimuth="235" elevation="45" />
                    </feSpecularLighting>
                    <feComposite k3="1" k2="1" operator="arithmetic" result="result4" in="SourceGraphic" in2="result91" />
                    <feComposite operator="in" result="result2" in="result4" in2="SourceAlpha" />
                </filter>
                <filter id="f114" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" numOctaves="5" baseFrequency=".02" result="result1" />
            <feComposite operator="in" in2="result1" result="result2" in="SourceGraphic" />
            <feColorMatrix result="result3" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 -1 " in="result2" />
        </filter>
        </defs >
        </svg >
    )
}

export const FullLogo = withStyles(styles)(FullLogoBase);