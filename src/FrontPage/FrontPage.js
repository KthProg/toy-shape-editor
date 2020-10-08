import React, { Component } from 'react'

import { Col, Container, Row } from 'react-bootstrap'

import './agency.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FrontPageHeader from './FrontPageHeader'
import ShapeEditor from '../ShapeEditor/ShapeEditor'

class FrontPage extends Component {
  constructor(){
    super();
  }

  render() {
    return (
      <div className="front-page">
        <link
          rel="icon"
          type="image/png"
          href={process.env.PUBLIC_URL + '/img/logos/toy-shape-editor.png'}
        />

        <FrontPageHeader
          homeLink="#page-top"
          links={[
            {
              href: '#editor',
              text: 'Toy Shape Editor',
            }
          ]}
          showButton={true}
          buttonText={'Start'}
          buttonLink={'#editor'}
          leadIn="Edit Toy Shapes"
        />

        <section className="bg-light" id="editor">
          <Container>
              <ShapeEditor />
          </Container>
        </section>

        <footer>
          <Container>
            <Row>
              <Col md="4">
                <span className="copyright">
                  Copyright &copy; Toy Shape Company, LLC. 2020
                </span>
              </Col>
              <Col md="4">
                <ul className="list-inline social-buttons">
                  <li className="list-inline-item">
                    <a href="https://twitter.com/toyshapeseditor">
                      <FontAwesomeIcon icon={['fab', 'twitter']} />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="https://www.facebook.com/toyshapeseditor">
                      <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                    </a>
                  </li>
                </ul>
              </Col>
              <Col md="4">
                <ul className="list-inline quicklinks">
                  <li className="list-inline-item">
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">Terms of Use</a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    )
  }
}

export default FrontPage
