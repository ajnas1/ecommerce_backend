import paypal from "paypal-rest-sdk";

const paypal_ = paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AdyHEOjGKpiOKO_HeM6kCNUcqK0hne6AMqh1XF0EWlQVyfDmfAE_bTNPOhoS7wq6eH9C7ozsWsJr6Fsm',
    'client_secret': 'ECeeQTJ7kyeTa-kZga4a1bEiFpt4unxjzi1fNGvkiWnAvnaAMbzYryKjnjtwTwst4ZoY0NTIfZuzY0PC'
});

export default paypal_;