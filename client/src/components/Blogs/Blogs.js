import React, { Fragment } from 'react';
import './Blogs.css';
import { connect } from 'react-redux';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';

import BlogListItem from '../BlogListItem/BlogListItem';
import getBlogs from '../../redux/selectors/getBlogs';
import { sortByDate } from '../../redux/actions/filters';
import { getBlogsFromDb } from '../../controllers/getBlogs';
import { addBlogArr } from '../../redux/actions/blogs';
import { userLogOut } from '../../redux/actions/auth';

class Blogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortByCreatedAt: false,
      sortByModifiedAt: false
    }
    this.handleCreatedAt = this.handleCreatedAt.bind(this);
    this.handleModifiedAt = this.handleModifiedAt.bind(this);
  }

  handleCreatedAt() {
    this.setState((prevState) => ({ sortByCreatedAt: !(prevState.sortByCreatedAt) }));
    // dispatching sortByDate by currently occured clicked event
    this.props.dispatch(sortByDate(!(this.state.sortByCreatedAt) ? 'dateCreatedAtUp' : 'dateCreatedAtDown'));
  }

  handleModifiedAt() {
    this.setState((prevState) => ({ sortByModifiedAt: !(prevState.sortByModifiedAt) }));
    // dispatching sortByDate by currently occured clicked event
    this.props.dispatch(sortByDate(!(this.state.sortByModifiedAt) ? 'dateLastModifiedUp' : 'dateLastModifiedDown'));
  }

  componentWillMount() {
    if (!this.props.blogs.length > 0) {
      getBlogsFromDb().then(res => {
        if (res.blogs) {
          this.props.dispatch(addBlogArr(res.blogs));
        } else {
          this.props.dispatch(userLogOut());
        }
      });
    }
  }

  render() {
    return (
      <div className='blogs-list'>
        <Paper>
          {/* Only to show table if there is atleast one blog in list */}
          {this.props.blogs.length > 0 ?
            (
              <Fragment>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>
                        {/*button for click event to sort by creation date */}
                        <Button size="small" onClick={this.handleCreatedAt}>
                          Created At
                            <span className='date-icons'>
                            {this.state.sortByCreatedAt ?
                              (
                                <i className="fal fa-long-arrow-down"></i>
                              ) :
                              (
                                <i className="fal fa-long-arrow-up"></i>
                              )
                            }
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        {/*button for click event to sort by last modified date */}
                        <Button size="small" onClick={this.handleModifiedAt}>
                          Last Modified
                            <span className='date-icons'>
                            {this.state.sortByModifiedAt ?
                              (
                                <i className="fal fa-long-arrow-down"></i>
                              ) :
                              (
                                <i className="fal fa-long-arrow-up"></i>
                              )
                            }
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        Shared
                      </TableCell>
                      <TableCell>
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {/* Mapping over each item in array of blog */}
                  <TableBody>
                    {this.props.blogs.map(blog => <BlogListItem key={blog.id} blog={blog} />)}
                  </TableBody>
                </Table>
              </Fragment>
            )
            : null}

        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    blogs: getBlogs(state.blogs, state.filters)
  }
}

export default connect(mapStateToProps)(Blogs);