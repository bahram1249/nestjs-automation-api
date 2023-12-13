jQuery( document ).ready( function ( $ )
{
	$.fn.custom_select = function ()
	{
		const body = document.body;
		const select = this[0];
		const options = select.options;

		function setcustomSelectValue ()
		{
			for ( let i = 0 ; i < options.length ; i++ )
			{
				if ( options[i].selected && i > 0 )
				{
					customSelectValue.textContent = options[i].innerText;
					return;
				}
				else
					customSelectValue.textContent = options[0].innerText;
			}
		}

		//hide native select
		select.style.border = '0';
		select.style.clip = 'rect(0 0 0 0)';
		select.style.height = '1px';
		select.style.margin = '-1px';
		select.style.overflow = 'hidden';
		select.style.padding = '0';
		select.style.position = 'absolute';
		select.style.width = '1px';
		select.classList.add( 'custom-select-native' );

		//create custom SELECT element
		const customSelect = document.createElement( 'div' );
		customSelect.classList.add( 'custom-select' );

		//create custom select VALUE element
		const customSelectValue = document.createElement( 'div' );
		customSelectValue.classList.add( 'custom-select-value' );

		setcustomSelectValue();

		if ( select.disabled )
		{
			customSelectValue.style.opacity = "0.6";
			customSelectValue.style.cursor = "default";
		}

		//create custom select DROPDOWN element
		const customSelectDropdown = document.createElement( 'div' );
		customSelectDropdown.classList.add( 'custom-select-dropdown' );

		const customSelectDropdown_inner = document.createElement( 'div' );
		customSelectDropdown_inner.classList.add( 'custom-select-dropdown-inner' );

		customSelectDropdown.appendChild( customSelectDropdown_inner )

		//add VALUE element to SELECT element
		customSelect.appendChild( customSelectValue );

		//wrap native select with SELECT element
		select.parentNode.insertBefore( customSelect, select );
		customSelect.appendChild( select );

		//create CUSTOM OPTIONS
		const createCustomOption = ( optionVal, option ) =>
		{
			const newOption = document.createElement( 'div' );
			newOption.classList.add( 'custom-select-option' );

			if ( option.hasAttribute( "disabled" ) )
				newOption.setAttribute( 'disabled', "disabled" );

			newOption.textContent = optionVal;
			return newOption;
		}

		for ( let i = 0 ; i < options.length ; i++ )
			customSelectDropdown_inner.appendChild( createCustomOption( options[i].innerText, options[i] ) )

		//select an option
		const selectCustomOption = () =>
		{
			const customOptions = document.querySelectorAll( '.custom-select-option' );
			const handleCustomOptionClick = e =>
			{
				if ( !e.target.hasAttribute( "disabled" ) )
				{
					customSelectValue.textContent = e.target.textContent;
					customSelectValue.style.color = "#25282b";

					Array.prototype.forEach.call( customSelectValue.nextElementSibling.options, option =>
					{
						option.removeAttribute( "selected" );

						if ( option.text === customSelectValue.innerText )
						{
							option.setAttribute( "selected", "selected" );

							$( '#reservation-panel .c-tab-content#flight .details-wrapper .flight-class-type' ).trigger( 'change' );
						}
					} );
				}
			}

			for ( let i = 0 ; i < customOptions.length ; i++ )
				customOptions[i].addEventListener( 'click', handleCustomOptionClick )
		}

		//removing the DROPDOWN
		const removeCustomSelectDropdown = () =>
		{
			customSelect.classList.remove( 'custom-select--open' );
			body.removeChild( customSelectDropdown );
		}

		//add DROPDOWN element styles
		const customSelectDropdownStyles = () =>
		{
			const boundingRect = customSelectValue.getBoundingClientRect();
			const dropdownStyle = customSelectDropdown.style;

			dropdownStyle.position = 'absolute';
			dropdownStyle.width = `${customSelectValue.offsetWidth}px`;
			dropdownStyle.left = `${boundingRect.x + pageXOffset}px`;
			dropdownStyle.top = `${boundingRect.y + pageYOffset + boundingRect.height}px`;
		}

		//add DROPDOWN element to Body element when VALUE is clicked
		customSelectValue.addEventListener( 'click', e =>
		{
			e.stopPropagation();
			customSelect.classList.remove( 'custom-select--open' );
			body.querySelectorAll( ".custom-select-dropdown" ).forEach( dropDown => {
				dropDown.remove();
			} )

			if ( body.contains( customSelectDropdown ) )
				removeCustomSelectDropdown();
			else
			{
				if ( !select.disabled )
				{
					//apply dropdown styles
					customSelectDropdownStyles();

					//add dropdown element to the page
					customSelect.classList.add( 'custom-select--open' );
					body.appendChild( customSelectDropdown );
					customSelectDropdown.style.marginTop = "5px";

					//select options functionality
					selectCustomOption();
				}
			}
		} )

		//remove dropdown on click outside
		document.addEventListener( 'click', ( e ) =>
		{
			if ( body.contains( customSelectDropdown ) )
			{
				if ( !e.target.hasAttribute( "disabled" ) )
					removeCustomSelectDropdown();
			}
		} )

		//remove dropdown on window resize
		window.addEventListener( 'resize', () =>
		{
			if ( body.contains( customSelectDropdown ) )
				removeCustomSelectDropdown();
		} )
	}
	$( '.select' ).each( function () {
		$( this ).custom_select();
	} );
} );

