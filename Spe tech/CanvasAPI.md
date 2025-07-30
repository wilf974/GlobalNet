========================
CODE SNIPPETS
========================
TITLE: Accessing Course Start Date String in canvasapi (Python)
DESCRIPTION: Demonstrates how to access the `start_at` attribute of a course object, which returns the start date and time as an ISO 8601 formatted string.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_7

LANGUAGE: python
CODE:
```
>>> course.start_at
'2014-02-11T16:38:00Z'
```

----------------------------------------

TITLE: Troubleshooting Good Canvas Base URLs (Examples)
DESCRIPTION: Examples of correctly formatted base URLs that can be used when initializing the CanvasAPI object. These URLs follow the required format: starting with https://, no /api/v1/, no trailing slash, and no leading/trailing whitespace.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/troubleshooting.rst#_snippet_1

LANGUAGE: text
CODE:
```
"https://example.edu"
```

LANGUAGE: text
CODE:
```
"https://canvas.example.edu"
```

LANGUAGE: text
CODE:
```
"https://example.edu/canvas"
```

----------------------------------------

TITLE: Passing Keyword Arguments - CanvasAPI - Python
DESCRIPTION: This example shows how to pass keyword arguments to CanvasAPI methods that correspond to API endpoint parameters. Here, the `enrollment_status='active'` argument is passed to `user.get_courses()` to filter the results to only active courses. This allows fine-grained control over API requests.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_4

LANGUAGE: Python
CODE:
```
# Get all of the active courses a user is currently enrolled in
>>> courses = user.get_courses(enrollment_status='active')
```

----------------------------------------

TITLE: Managing Course Objects - CanvasAPI - Python
DESCRIPTION: This example shows how to retrieve a specific course by ID using `canvas.get_course()`. It then demonstrates accessing an attribute (`name`) of the returned `Course` object and updating the course's properties using the `update()` method. The `update()` method takes a dictionary of parameters.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_1

LANGUAGE: Python
CODE:
```
# Grab course 123456
>>> course = canvas.get_course(123456)

# Access the course's name
>>> course.name
'Test Course'

# Update the course's name
>>> course.update(course={'name': 'New Course Name'})
```

----------------------------------------

TITLE: Initializing - CanvasAPI - Python
DESCRIPTION: This snippet demonstrates how to import the `Canvas` class and create an instance of it. It requires the Canvas API URL and a valid API key. The resulting `canvas` object is used to make subsequent API calls.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_0

LANGUAGE: Python
CODE:
```
# Import the Canvas class
from canvasapi import Canvas

# Canvas API URL
API_URL = "https://example.com"
# Canvas API key
API_KEY = "p@$$w0rd"

# Initialize a new Canvas object
canvas = Canvas(API_URL, API_KEY)
```

----------------------------------------

TITLE: Accessing Course Start Date Datetime Object in canvasapi (Python)
DESCRIPTION: Demonstrates how to access the `start_at_date` attribute of a course object, which returns the start date and time as a timezone-aware `datetime.datetime` object.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_8

LANGUAGE: python
CODE:
```
>>> course.start_at_date
datetime.datetime(2014, 2, 11, 16, 38, tzinfo=<UTC>)
```

----------------------------------------

TITLE: Creating a New User under an Account - Python
DESCRIPTION: Shows how to get an account object by ID and then use its create_user method to add a new user with specified name, password, and SIS user ID.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_1

LANGUAGE: python
CODE:
```
# Grab the account to create the user under
account = canvas.get_account(1)

user = account.create_user(
    user={
        'name': 'New User'            
    },
    pseudonym={
        'password': 'secure123',
        'sis_user_id': 'new_user'
    }
)
```

----------------------------------------

TITLE: Troubleshooting Bad Canvas Base URLs (Examples)
DESCRIPTION: Examples of incorrectly formatted base URLs that should be avoided when initializing the CanvasAPI object. These examples violate rules such as missing scheme, including API path, trailing slashes, or whitespace.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/troubleshooting.rst#_snippet_0

LANGUAGE: text
CODE:
```
"example.edu"
```

LANGUAGE: text
CODE:
```
"http://example.edu"
```

LANGUAGE: text
CODE:
```
"https://example.edu/api/v1/"
```

LANGUAGE: text
CODE:
```
"https://example.edu/"
```

LANGUAGE: text
CODE:
```
"https://canvas.example.edu/"
```

LANGUAGE: text
CODE:
```
"https://example.edu/canvas/"
```

LANGUAGE: text
CODE:
```
" https://example.edu"
```

LANGUAGE: text
CODE:
```
"https://example.edu "
```

----------------------------------------

TITLE: Managing User Objects - CanvasAPI - Python
DESCRIPTION: This snippet illustrates retrieving a user by their ID using `canvas.get_user()`. It shows accessing a user attribute (`name`) and retrieving a list of courses the user is enrolled in using `user.get_courses()`. It also demonstrates retrieving a user by their SIS login ID.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_2

LANGUAGE: Python
CODE:
```
# Grab user 123
>>> user = canvas.get_user(123)

# Access the user's name
>>> user.name
'Test User'

# Retrieve a list of courses the user is enrolled in
>>> courses = user.get_courses()

# Grab a different user by their SIS ID
>>> login_id_user = canvas.get_user('some_user', 'sis_login_id')
```

----------------------------------------

TITLE: Passing Datetime Objects - CanvasAPI - Python
DESCRIPTION: This snippet demonstrates how CanvasAPI simplifies handling dates by allowing Python `datetime` objects to be passed directly to methods expecting ISO 8601 strings. It shows updating the `start_at` and `end_at` dates of a course using `datetime` objects created with specific year, month, day, hour, and minute values.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_5

LANGUAGE: Python
CODE:
```
from datetime import datetime

start_date = datetime(2018, 1, 1, 0, 1)  # '2018-01-01T00:01Z'
end_date = datetime(2018, 12, 31, 11, 59)  # '2018-12-31T11:59Z'

course.update(
    course={
        'start_at': start_date,
        'end_at': end_date,
    }
)
```

----------------------------------------

TITLE: Troubleshooting Good Canvas Access Tokens (Examples)
DESCRIPTION: Examples of correctly formatted access tokens that can be used with CanvasAPI. These tokens are valid, do not include "Bearer", have no leading/trailing whitespace, and may include a shard ID separated by a tilde (~).

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/troubleshooting.rst#_snippet_3

LANGUAGE: text
CODE:
```
"7H155up3r53CR3770K3n15n07R34L4Nd5h0uLDN0783u53dpL34534Nd7H4nKY0u"
```

LANGUAGE: text
CODE:
```
"1~7H155up3r53CR3770K3n15n07R34L4Nd5h0uLDN083u53dpL34534Nd7H4nKY0u"
```

----------------------------------------

TITLE: Installing CanvasAPI with pip
DESCRIPTION: This command installs the CanvasAPI library using the pip package manager. It is the standard way to add the library to your Python environment.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
pip install canvasapi
```

----------------------------------------

TITLE: Initializing CanvasAPI Client - Python
DESCRIPTION: Demonstrates how to import the Canvas class and initialize a Canvas object using the API URL and key. This object is the entry point for making subsequent API calls.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_0

LANGUAGE: python
CODE:
```
# Import the Canvas class
from canvasapi import Canvas

# Canvas API URL
API_URL = "https://example.com"
# Canvas API key
API_KEY = "p@$$w0rd"

# Initialize a new Canvas object
canvas = Canvas(API_URL, API_KEY)
```

----------------------------------------

TITLE: Troubleshooting Bad Canvas Access Tokens (Examples)
DESCRIPTION: Examples of incorrectly formatted or invalid access tokens that should not be used with CanvasAPI. Issues include leading/trailing whitespace, including "Bearer", incorrect format, or being too short.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/troubleshooting.rst#_snippet_2

LANGUAGE: text
CODE:
```
" 7H155up3r53CR3770K3n15n07R34L4Nd5h0uLDN0783u53dpL34534Nd7H4nKY0u"
```

LANGUAGE: text
CODE:
```
"7H155up3r53CR3770K3n15n07R34L4Nd5h0uLDN0783u53dpL34534Nd7H4nKY0u "
```

LANGUAGE: text
CODE:
```
"Bearer 7H155up3r53CR3770K3n15n07R34L4Nd5h0uLDN0783u53dpL34534Nd7H4nKY0u"
```

LANGUAGE: text
CODE:
```
"1 7H155up3r53CR3770K3n15n07R34L4Nd5h0uLDN0783u53dpL34534Nd7H4nKY0u"
```

LANGUAGE: text
CODE:
```
"7H155up3r53CR3770K3n15n07R34L4Nd5h0uLDN0783u53dpL34534Nd7H4nKY0"
```

----------------------------------------

TITLE: Updating Course Dates (ISO8601) - Python
DESCRIPTION: Shows how to update a course's start and end dates using ISO8601 formatted date strings passed to the update method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_14

LANGUAGE: python
CODE:
```
course.update(
    course={
        'start_at': '2018-01-01T00:01Z',
        'end_at': '2018-12-31T11:59Z'
    }
)
```

----------------------------------------

TITLE: Listing All Users in a Course - Python
DESCRIPTION: Retrieves all users enrolled in a specific course object using the get_users method and iterates through the results.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_9

LANGUAGE: python
CODE:
```
users = course.get_users()

for user in users:
    print(user)
```

----------------------------------------

TITLE: Listing User Logins - Python
DESCRIPTION: Fetches all login records associated with a user object using the get_user_logins method and iterates through them, printing each login.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_7

LANGUAGE: python
CODE:
```
logins = user.get_user_logins()

for login in logins:
    print(login)
```

----------------------------------------

TITLE: Handling Paginated Lists - CanvasAPI - Python
DESCRIPTION: This snippet demonstrates how to work with `PaginatedList` objects returned by methods like `user.get_courses()`. It shows accessing elements by index, iterating through the list, and taking slices, highlighting the lazy loading behavior. `PaginatedList` behaves similarly to standard Python lists for these operations.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_3

LANGUAGE: Python
CODE:
```
# Retrieve a list of courses the user is enrolled in
>>> courses = user.get_courses()

>>> print(courses)
<PaginatedList of type Course>

# Access the first element in our list.
#
# You'll notice the first call takes a moment, but the next N-1
# elements (where N = the per_page argument supplied; the default is 10)
# will be instantly accessible.
>>> print(courses[0])
TST101 Test Course (1234567)

# Iterate over our course list
>>> for course in courses:
             print(course)

TST101 Test Course 1 (1234567)
TST102 Test Course 2 (1234568)
TST103 Test Course 3 (1234569)

# Take a slice of our course list
>>> courses[:2]
[TST101 Test Course 1 (1234567), TST102 Test Course 2 (1234568)]
```

----------------------------------------

TITLE: Getting a User by SIS Login ID - Python
DESCRIPTION: Fetches a user object from Canvas using their SIS login ID by calling the get_user method with the identifier and 'sis_login_id' type.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_3

LANGUAGE: python
CODE:
```
# Grab a user with the SIS ID of 'some_id'
user = canvas.get_user('some_id', 'sis_login_id')
```

----------------------------------------

TITLE: Listing Courses under an Account - Python
DESCRIPTION: Retrieves all courses associated with a specific account using the get_courses method and iterates through the results, printing each course object.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_2

LANGUAGE: python
CODE:
```
courses = account.get_courses()

for course in courses:
    print(course)
```

----------------------------------------

TITLE: Getting a Course by Canvas ID - Python
DESCRIPTION: Retrieves a course object from Canvas using its unique Canvas ID by calling the get_course method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_8

LANGUAGE: python
CODE:
```
# Grab course with ID of 123456
course = canvas.get_course(123456)
```

----------------------------------------

TITLE: Listing Teachers, TAs, and Designers in a Course - Python
DESCRIPTION: Retrieves users with specific enrollment types ('teacher', 'ta', 'designer') in a course by passing a list to the enrollment_type parameter of get_users.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_11

LANGUAGE: python
CODE:
```
type_list = ['teacher', 'ta', 'designer']

users = course.get_users(enrollment_type=type_list)

for user in users:
    print(user)
```

----------------------------------------

TITLE: Getting a User's Page Views - Python
DESCRIPTION: Retrieves the page view history for a specific user object using the get_page_views method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_6

LANGUAGE: python
CODE:
```
page_views = user.get_page_views()
```

----------------------------------------

TITLE: Listing All Assignments in a Course - Python
DESCRIPTION: Retrieves all assignments associated with a course using the get_assignments method and iterates through the results.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_19

LANGUAGE: python
CODE:
```
assignments = course.get_assignments()

for assignment in assignments:
    print(assignment)
```

----------------------------------------

TITLE: Updating Course Dates (DateTime Object) - Python
DESCRIPTION: Shows how to update a course's start and end dates using Python datetime objects passed to the update method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_15

LANGUAGE: python
CODE:
```
from datetime import datetime

start_date = datetime(2018, 1, 1, 0, 1)
end_date = datetime(2018, 12, 31, 11, 59)

course.update(
    course={
        'start_at': start_date,
        'end_at': end_date
    }
)
```

----------------------------------------

TITLE: Getting a User by Canvas ID - Python
DESCRIPTION: Retrieves a user object from Canvas using their unique Canvas ID by calling the get_user method with the ID.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_4

LANGUAGE: python
CODE:
```
# Grab user with ID of 1
user = canvas.get_user(1)
```

----------------------------------------

TITLE: Updating a Course's Name - Python
DESCRIPTION: Demonstrates how to fetch a course object and update its name attribute using the update method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_13

LANGUAGE: python
CODE:
```
print(course.name)  # prints 'Old Name'

course.update(course={'name': 'New Name'})

print(course.name)  # prints 'New Name'
```

----------------------------------------

TITLE: Listing Active/Invited Students and Teachers in a Course - Python
DESCRIPTION: Retrieves users with 'teacher' or 'student' enrollment types who are in 'active' or 'invited' states within a course using the enrollment_type and enrollment_state parameters of get_users.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_12

LANGUAGE: python
CODE:
```
users = course.get_users(
    enrollment_type=['teacher', 'student'],
    enrollment_state=['active', 'invited']
)

for user in users:
    print(user)
```

----------------------------------------

TITLE: Getting a Single Assignment by ID - Python
DESCRIPTION: Retrieves a specific assignment object from a course using its ID by calling the get_assignment method on the course object.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_18

LANGUAGE: python
CODE:
```
# Grab assignment with ID of 1234
assignment = course.get_assignment(1234)

print(assignment)
```

----------------------------------------

TITLE: Accessing Parsed Datetimes - CanvasAPI - Python
DESCRIPTION: This snippet implicitly shows the result of retrieving an object with datetime strings from the Canvas API. CanvasAPI automatically parses ISO 8601 datetime strings into Python `datetime` objects, making them available as new attributes with `_date` appended to the original key (e.g., `start_at` becomes `start_at_date`). The original string attribute is also preserved.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/getting-started.rst#_snippet_6

LANGUAGE: Python
CODE:
```
>>> course = canvas.get_course(1)
```

----------------------------------------

TITLE: Recommended Canvas API URL Format Python
DESCRIPTION: Example of the recommended format for the Canvas API root URL when initializing the Canvas object. Only the root domain should be provided, without '/api/v1/'.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/CHANGELOG.md#_snippet_4

LANGUAGE: Python
CODE:
```
"https://example.com"
```

----------------------------------------

TITLE: Concluding a Course - Python
DESCRIPTION: Marks a course as concluded using the conclude method, typically making it read-only for students.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_16

LANGUAGE: python
CODE:
```
course.conclude()
```

----------------------------------------

TITLE: Listing Only Students in a Course - Python
DESCRIPTION: Retrieves only users with the 'student' enrollment type in a course using the get_users method with the enrollment_type parameter.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_10

LANGUAGE: python
CODE:
```
users = course.get_users(enrollment_type=['student'])

for user in users:
    print(user)
```

----------------------------------------

TITLE: Working with CanvasAPI Paginated Lists in Python
DESCRIPTION: This example demonstrates retrieving a PaginatedList of courses and shows how it appears when printed. It also mentions accessing elements by index, highlighting the lazy loading behavior.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_4

LANGUAGE: Python
CODE:
```
# Retrieve a list of courses the user is enrolled in
>>> courses = user.get_courses()

>>> print(courses)
<PaginatedList of type Course>

# Access the first element in our list.
#
# You'll notice the first call takes a moment, but the next N-1
```

----------------------------------------

TITLE: Editing an Existing User - Python
DESCRIPTION: Demonstrates how to fetch a user object by ID and then use its edit method to update attributes, such as changing the user's name.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_5

LANGUAGE: python
CODE:
```
# Grab the user
user = canvas.get_user(1)

user.edit(
    user={'name': 'New Name'}
)
```

----------------------------------------

TITLE: Listing Ungraded Assignments in a Course - Python
DESCRIPTION: Retrieves only assignments in a course that are currently in the 'ungraded' bucket by passing the bucket parameter to the get_assignments method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_20

LANGUAGE: python
CODE:
```
assignments = course.get_assignments(bucket='ungraded')

for assignment in assignments:
    print(assignment)
```

----------------------------------------

TITLE: Getting User Courses with Keyword Arguments (Python)
DESCRIPTION: Demonstrates how to use keyword arguments with a CanvasAPI method (get_courses) to filter results, specifically retrieving only active courses for a user.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_8

LANGUAGE: Python
CODE:
```
courses = user.get_courses(enrollment_state='active')
```

----------------------------------------

TITLE: Slicing CanvasAPI Course List (Python)
DESCRIPTION: Illustrates how to take a slice of a list or sequence of course objects returned by a CanvasAPI call, getting the first two elements.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_7

LANGUAGE: Python
CODE:
```
courses[:2]
```

----------------------------------------

TITLE: Deleting a Course - Python
DESCRIPTION: Permanently deletes a course from Canvas using the delete method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/examples.rst#_snippet_17

LANGUAGE: python
CODE:
```
course.delete()
```

----------------------------------------

TITLE: Accessing and Updating Canvas Course Objects in Python
DESCRIPTION: This example shows how to retrieve a specific course by ID using the initialized Canvas object. It then demonstrates accessing an attribute (name) and updating the course using the update method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_2

LANGUAGE: Python
CODE:
```
# Grab course 123456
>>> course = canvas.get_course(123456)

# Access the course's name
>>> course.name
'Test Course'

# Update the course's name
>>> course.update(course={'name': 'New Course Name'})
```

----------------------------------------

TITLE: Executing CanvasAPI Method with Logging Enabled (Python)
DESCRIPTION: This snippet shows an example of calling a CanvasAPI method (`get_current_user()`) after the logging configuration has been applied. The description explains that executing this line will trigger the configured logger to output detailed information about the HTTP request and response, including URLs, headers, status codes, and response data, which is useful for debugging.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/debugging.rst#_snippet_1

LANGUAGE: python
CODE:
```
canvas.get_current_user()
```

----------------------------------------

TITLE: Initializing CanvasAPI Client in Python
DESCRIPTION: This snippet demonstrates how to import the Canvas class and create an instance using your Canvas API URL and a valid API key. This initialized object is the entry point for making subsequent API calls.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_1

LANGUAGE: Python
CODE:
```
# Import the Canvas class
from canvasapi import Canvas

# Canvas API URL
API_URL = "https://example.com"
# Canvas API key
API_KEY = "p@$$w0rd"

# Initialize a new Canvas object
canvas = Canvas(API_URL, API_KEY)
```

----------------------------------------

TITLE: Calling get_users with Multiple Basic Parameters (Python)
DESCRIPTION: Shows how to pass multiple basic parameters, `search_term` and `enrollment_role`, as keyword arguments to the `get_users` method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_1

LANGUAGE: python
CODE:
```
course.get_users(
    search_term='John Doe',
    enrollment_role='StudentEnrollment'
)
```

----------------------------------------

TITLE: Calling create_course with Mixed Nested and Basic Parameters (Python)
DESCRIPTION: Combines nested parameters (via the `course` dictionary) with basic parameters (`enroll_me`, `offer`) when calling the `create_course` method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_7

LANGUAGE: python
CODE:
```
account.create_course(
    course={
        'name': 'Example Course',
        'course_code': 'TST1234',
        'is_public': True
    },
    enroll_me=True,
    offer=False
)
```

----------------------------------------

TITLE: Calling get_users with Mixed Basic and List Parameters (Python)
DESCRIPTION: Combines basic (`search_term`) and list (`enrollment_type`, `include`) parameters when calling `get_users`, showing how to pass both types simultaneously.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_3

LANGUAGE: python
CODE:
```
course.get_users(
    enrollment_type=['teacher', 'student'],
    search_term='John',
    include=['email']
)
```

----------------------------------------

TITLE: Calling get_users with Basic Parameter (Python)
DESCRIPTION: Demonstrates calling the `get_users` method on a `Course` object, passing a single basic parameter `search_term` as a keyword argument.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_0

LANGUAGE: python
CODE:
```
course.get_users(search_term='John Doe')
```

----------------------------------------

TITLE: Development and Documentation Dependencies
DESCRIPTION: This snippet lists Python package dependencies needed for running tests and building documentation. It includes a reference to another requirements file (`tests_requirements.txt`) and specific versions of packages like docutils, pre-commit, and Sphinx-related tools.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/dev_requirements.txt#_snippet_0

LANGUAGE: Requirements
CODE:
```
-r tests_requirements.txt
docutils==0.15.2
pre-commit
Sphinx
sphinx-rtd-theme
sphinx-version-warning
```

----------------------------------------

TITLE: Calling get_users with List Parameter (Python)
DESCRIPTION: Illustrates passing a list parameter `enrollment_type` to the `get_users` method by providing a Python list as the keyword argument value.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_2

LANGUAGE: python
CODE:
```
course.get_users(enrollment_type=['teacher', 'student'])
```

----------------------------------------

TITLE: Getting File Contents CanvasAPI Python
DESCRIPTION: Retrieves the contents of a file directly from a CanvasAPI File object. This method returns the file's data as a string or bytes.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/CHANGELOG.md#_snippet_0

LANGUAGE: Python
CODE:
```
file.get_contents()
```

----------------------------------------

TITLE: Calling create_course with Multiple Nested Parameters (Python)
DESCRIPTION: Demonstrates passing multiple nested parameters (`course[name]`, `course[course_code]`, `course[is_public]`) by including multiple key-value pairs within the dictionary passed to the `course` keyword argument.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_6

LANGUAGE: python
CODE:
```
account.create_course(
    course={
        'name': 'Example Course',
        'course_code': 'TST1234',
        'is_public': True
    }
)
```

----------------------------------------

TITLE: Calling create_course with Single Nested Parameter (Python)
DESCRIPTION: Shows the correct way to pass a single nested parameter (`course[name]`) to the `create_course` method by using a dictionary for the `course` keyword argument.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_5

LANGUAGE: python
CODE:
```
account.create_course(course={'name': 'Example Course'})
```

----------------------------------------

TITLE: Getting Current User CanvasAPI Python
DESCRIPTION: Accesses the CurrentUser object, which contains methods exclusive to the API Key owner's user. This method is called on the main Canvas object.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/CHANGELOG.md#_snippet_2

LANGUAGE: Python
CODE:
```
canvas.get_current_user()
```

----------------------------------------

TITLE: Tagging a release version with Git
DESCRIPTION: Creates a signed, annotated Git tag for a specific commit (abc1234) with a version number (v0.0.0) and a message. This is typically used to mark a release point in the repository history.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/DEPLOY.md#_snippet_0

LANGUAGE: Shell
CODE:
```
git tag -s v0.0.0 -m "Release version 0.0.0" abc1234
```

----------------------------------------

TITLE: Pushing a Git tag to remote
DESCRIPTION: Pushes the specified Git tag (v0.0.0) to the remote repository named 'upstream'. This makes the tag available to others and can trigger automated processes like deployment.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/DEPLOY.md#_snippet_1

LANGUAGE: Shell
CODE:
```
git push upstream v0.0.0
```

----------------------------------------

TITLE: Deprecated Canvas API URL Format Python
DESCRIPTION: Example of the deprecated format for the Canvas API root URL when initializing the Canvas object. Including '/api/v1/' is no longer recommended and will be removed in a future release.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/CHANGELOG.md#_snippet_3

LANGUAGE: Python
CODE:
```
"https://example.com/api/v1/"
```

----------------------------------------

TITLE: Adding Grading Standards with List of Dictionaries (Python)
DESCRIPTION: Demonstrates how to use `account.add_grading_standards` by providing the `grading_scheme_entry` parameter as a list of dictionaries, where each dictionary represents a grading level with 'name' and 'value'. This format corresponds to Canvas API parameters like `foo[][bar]`.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/keyword-args.rst#_snippet_9

LANGUAGE: python
CODE:
```
account.add_grading_standards(
    title='New Grading Standard',
    grading_scheme_entry=[
        {
            'name': 'A',
            'value': 90
        },
        {
            'name': 'B',
            'value': 80
        }
    ]
)
```

----------------------------------------

TITLE: Iterating Over CanvasAPI Course List (Python)
DESCRIPTION: Shows how to loop through a list or sequence of course objects obtained from a CanvasAPI call, printing each course.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_6

LANGUAGE: Python
CODE:
```
for course in courses:
         print(course)
```

----------------------------------------

TITLE: Configuring CanvasAPI Logging in Python
DESCRIPTION: This snippet demonstrates how to set up the Python standard logging module to capture and display log messages generated by the `canvasapi` library. It configures a logger for the 'canvasapi' namespace, adds a stream handler to output logs to standard output, sets a formatter for log message structure, and sets the logging level to DEBUG to capture detailed information.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/docs/debugging.rst#_snippet_0

LANGUAGE: python
CODE:
```
import logging
import sys

logger = logging.getLogger("canvasapi")
handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

handler.setLevel(logging.DEBUG)
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
```

----------------------------------------

TITLE: Accessing First Element from CanvasAPI Course List (Python)
DESCRIPTION: Demonstrates how to access the first element (a course object) from a list or sequence of courses returned by a CanvasAPI call.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_5

LANGUAGE: Python
CODE:
```
print(courses[0])
```

----------------------------------------

TITLE: Accessing Canvas User Objects and Courses in Python
DESCRIPTION: This snippet illustrates how to retrieve a user by ID or SIS login ID. It shows accessing user attributes and retrieving a list of courses the user is enrolled in using the get_courses method.

SOURCE: https://github.com/ucfopen/canvasapi/blob/develop/README.md#_snippet_3

LANGUAGE: Python
CODE:
```
# Grab user 123
>>> user = canvas.get_user(123)

# Access the user's name
>>> user.name
'Test User'

# Retrieve a list of courses the user is enrolled in
>>> courses = user.get_courses()

# Grab a different user by their SIS ID
>>> login_id_user = canvas.get_user('some_user', 'sis_login_id')
```