import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Emotions } from '../api/emotions.js';
 
import './body.html';
 

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  emotions() {
    return Emotions.find({}, { sort: { createdAt: -1 } });
  },
  currentEmotion() {
    const instance = Template.instance();
    currentId = instance.state.get('currentEmotionId');
    return Emotions.findOne({ _id: currentId});
  },
});

Template.body.events({

  'submit .new-emotion'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;

    const author = target.author.value;
    const name = target.name.value;
    const shadow = target.shadow.value;
 		const sound = target.sound.value;
 		const mask = target.mask.value;
 		const pattern = target.pattern.value;

    // Insert a emotion into the collection
    Emotions.insert({
      
      author,
      name,
      shadow,
      sound,
      mask,
      pattern,

      createdAt: new Date(), // current time
    });
 
    // Clear form
    target.author.value = '';
    target.name.value = '';
    target.shadow.value = '';
    target.sound.value = '';
    target.mask.value = '';
    target.pattern.value = '';
  },

  'click #new-emotion-btn'() {
  	$('form.new-emotion').toggle();
  },

  'click [data-action="select-emotion"]'(event, instance) {
  	instance.state.set('currentEmotionId', this._id);

  	let hashEmotionId = '#' + this._id;
 		debugger;
 		if ($(".emotion-selected")[0]) {
 			$(".emotion-selected audio")[0].pause();
 		}
  	// $(hashEmotionId ).siblings().find("audio")[0].stop();
  	$(hashEmotionId ).addClass("emotion-selected");
  	$(hashEmotionId ).siblings().removeClass("emotion-selected");
  	$(hashEmotionId + ' audio')[0].play();
  },
});

Template.emotion.events({
  'click .delete'() {
  	if (confirm("Vous êtes sur le point de supprimer une émotion, êtes-vous sûrs ?")) {
    	Emotions.remove(this._id);
  	}
  },
});