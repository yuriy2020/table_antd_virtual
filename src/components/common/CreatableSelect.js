import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import Text from './Text'
import CreatableSelect from 'react-select/creatable'

export const CreatableMulti = ({
  classes,
  className,
  text,
  value,
  options,
  onChange,
  onCreateOption,
  theme,
  multiple,
  disabled,
  menuPlacement,
  placeholder,
  maxMenuHeight,
  isSearchable,
  defaultValue,
}) => {
  return (
    <CreatableSelect
      isDisabled={disabled}
      isMulti={multiple}
      onChange={onChange}
      onCreateOption={onCreateOption}
      options={options}
      defaultValue={defaultValue}
    />
  )
}

// class Select extends Component {
//   render() {
//     let {
//       classes,
//       className,
//       text,
//       value,
//       options,
//       onChange,
//       theme,
//       multiple,
//       disabled,
//       menuPlacement,
//       placeholder,
//       maxMenuHeight,
//       isSearchable,
//       defaultValue
//     } = this.props;

//     return <div>
//       {
//         text &&
//         <Text className={classes.text} color="textSecondary">{text}</Text>
//       }
//       <CreatableSelect
//         defaultValue={defaultValue}
//         isSearchable={isSearchable}
//         isDisabled={disabled}
//         placeholder={placeholder}
//         maxMenuHeight={maxMenuHeight}
//         isMulti={multiple}
//         menuPlacement={menuPlacement}
//         className={classNames(classes.gammaSelect, className)}
//         onChange={onChange}
//         styles={{
//           menu: (provided) => ({
//             ...provided,
//             border: "1px solid black" /*boxShadow: "1px 1px 1px 1px " + theme.borderColor + " !important"*/
//           }),
//           menuList: (provided) => ({...provided, backgroundColor: "white"}),
//           input: (provided) => ({ ...provided, color: theme.textSecondary })
//         }}
//         theme={{
//           borderRadius: 0,
//           colors: {
//             primary: theme.hover.dark,
//             primary75: theme.hover.main,
//             primary50: theme.hover.main,
//             primary25: theme.hover.main,
//           }
//         }}
//         value={value}
//         options={options}
//       />
//     </div>;
//   }
// }

// const size = 35;

// const styles = theme => ({
//   text: {
//     fontSize: 10,
//     marginBottom: -3,
//     fontWeight: "bold"
//   },
//   gammaSelect: {
//     //height: size,
//     width: props => props.fullWidth ? "100%" : "inherit",
//     //paddingLeft: 16,
//     //paddingRight: 46,
//     //appearance: "none",
//     outline: 0,
//     "&>*": {
//       borderColor: theme.borderColor + " !important",
//       fontSize: 14,
//       marginLeft: 4 + "px !important",
//       minWidth: 250,
//       boxShadow: "none !important",
//       borderRadius: "0px !important"
//     },
//     "& *": {
//       marginLeft: "inherit !important",
//       //overflow: "hidden"
//     }
//   },
// })

// export default injectSheet(styles)(Select)
