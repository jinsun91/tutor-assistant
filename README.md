# Tutor Assistant

### [Live Demo](https://tutor-assistant.vercel.app/)

An app to manage all the admin work that comes with being a tutor.   
It helps users keep track of their students, lessons, finances, and create invoices.

Created using NextJS 13, React, TypeScript, JavaScript, Tailwind CSS, Daisy UI, CSS, and HTML.

## Home Page
![Home](https://github.com/jinsun91/tutor-assistant/assets/33980648/7c5e5c78-0a1f-4f7a-9ecd-5303c4a1e40e)
- The Home page gives the user the list of today's lessons.   
- Upon completing a lesson you can **mark it as complete**, which will add that lesson's income amount to today's income.   
- Once you've completed all of your lessons for the day you can click the **auto add to finances** button, which will create an income entry in the Finances page for each lesson.
- The auto add to finances button will be disabled once you've clicked it for that day. If you want to enable it again, you can click the reset auto add button.

## Students Page
![Students](https://github.com/jinsun91/tutor-assistant/assets/33980648/a29b54e9-f9f6-45ee-9136-3b4e2973bcbf)
- **Add**, **edit**, and **delete** a student and see **information** about a student.

## Lessons Page
![Lessons](https://github.com/jinsun91/tutor-assistant/assets/33980648/f0306062-ccf8-476e-a2de-a51d55f44b3d)
- **Add**, **edit**, and **delete** a lesson and see **information** about a lesson.
- Completed lessons are green and uncompleted lessons are red.

## Finances Page
![Finances](https://github.com/jinsun91/tutor-assistant/assets/33980648/03dec85f-ee4e-4133-97b2-26ce0aba2ba9)
- **Add** and **edit** an income entry
- By selecting income entries in the table, you can batch **mark as received/not received** and **delete** income entries
- By selecting income entries in the table, you can **create an invoice**.
- Filter income entries based on **year**, **month**, and **student** to easily create invoices for a student at the end of the month.
