import React, { Component } from 'react'

import './agency.css'
import { Container, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class FrontPageHeader extends Component {
  constructor() {
    super()
    this.minLgWidth = 992
    this.state = {
      expanded: window.innerWidth < this.minLgWidth,
    }
    this.handleResize = this.handleResize.bind(this)
  }

  handleResize() {
    this.setState({
      expanded: window.innerWidth > this.minLgWidth,
    })
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    return (
      <>
        <Navbar
          className="navbar-dark fixed-top"
          id="mainNav"
          expand="lg"
          expanded={this.state.expanded}
          onToggle={() => this.setState({ expanded: !this.state.expanded })}
        >
          <Container>
            <Navbar.Brand
              as="a"
              className="js-scroll-trigger"
              href={this.props.homeLink}
            >
              <img
                className="logo"
                src={process.env.PUBLIC_URL + '/img/heart-nutrition.png'}
              />{' '}
              Toy Shape Editor
            </Navbar.Brand>
            <Navbar.Toggle
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <FontAwesomeIcon icon={['fas', 'bars']} /> Menu
            </Navbar.Toggle>
            <Navbar.Collapse id="navbarResponsive">
              <Nav className="text-uppercase ml-auto">
                {this.props.links.map((link) => (
                  link.subLinks && link.subLinks.length > 0 ?
                  (<NavDropdown title={link.text}>
                    {
                      link.subLinks.map(subLink => 
                        <NavDropdown.Item href={subLink.href || '#'} onClick={subLink.action}>
                          {subLink.text}
                        </NavDropdown.Item>)
                    }
                </NavDropdown>) :
                  (<Nav.Item>
                    <Nav.Link href={link.href} className="js-scroll-trigger">
                      {link.text}
                    </Nav.Link>
                  </Nav.Item>)
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <header className="masthead">
          <Container>
            <div className="intro-text">
              <div className="intro-lead-in">{this.props.leadIn}</div>
              {this.props.showButton && (
                <a
                  className="btn btn-primary btn-xl text-uppercase"
                  href={this.props.buttonLink}
                >
                  {this.props.buttonText}
                </a>
              )}
            </div>
          </Container>
        </header>
      </>
    )
  }
}

export default FrontPageHeader
