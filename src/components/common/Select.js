import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import Text from './Text'
import RSelect from 'react-select'

class Select extends Component {
  render() {
    let {
      classes,
      className,
      text,
      value,
      options,
      onChange,
      theme,
      multiple,
      disabled,
      menuPlacement,
      placeholder,
      maxMenuHeight,
      isSearchable,
    } = this.props

    return (
      <div>
        {text && (
          <Text className={classes.text} color='textSecondary'>
            {text}
          </Text>
        )}
        <RSelect
          isSearchable={isSearchable}
          isDisabled={disabled}
          placeholder={placeholder}
          maxMenuHeight={maxMenuHeight}
          isMulti={multiple}
          menuPlacement={menuPlacement}
          className={classNames(classes.gammaSelect, className)}
          onChange={onChange}
          styles={{
            menu: (provided) => ({
              ...provided,
              border: '1px solid black' /*boxShadow: "1px 1px 1px 1px " + theme.borderColor + " !important"*/,
            }),
            menuList: (provided) => ({ ...provided, backgroundColor: 'white' }),
            input: (provided) => ({ ...provided, color: theme.textSecondary }),
          }}
          theme={{
            borderRadius: 0,
            colors: {
              primary: theme.hover.dark,
              primary75: theme.hover.main,
              primary50: theme.hover.main,
              primary25: theme.hover.main,
            },
          }}
          value={value}
          options={options}
        />
      </div>
    )
  }
}

const size = 35

const styles = (theme) => ({
  text: {
    fontSize: 10,
    marginBottom: -3,
    fontWeight: 'bold',
  },
  gammaSelect: {
    //height: size,
    width: (props) => (props.fullWidth ? '100%' : 'inherit'),
    //paddingLeft: 16,
    //paddingRight: 46,
    //appearance: "none",
    outline: 0,
    '&>*': {
      borderColor: theme.borderColor + ' !important',
      fontSize: 14,
      marginLeft: 4 + 'px !important',
      minWidth: 250,
      boxShadow: 'none !important',
      borderRadius: '0px !important',
    },
    '& *': {
      marginLeft: 'inherit !important',
      //overflow: "hidden"
    },
  },
})

export default injectSheet(styles)(Select)
